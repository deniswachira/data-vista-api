import "dotenv/config";
import { Context } from "hono";
import { checkIsPremium, getUserByIdService, updateUserService, upgrateToPremiumService } from "./user.service";



//get user by id
export const getUserById = async (c: Context) => {
    const user_id = parseInt(c.req.param("user_id"));
    if (isNaN(user_id)) return c.text("Invalid ID", 400);

    const user = await getUserByIdService(user_id);
    if (user == undefined) {
        return c.text("User not found 😒", 404);
    }
    return c.json(user, 200);
}

//update user
export const updateUser = async (c: Context) => {
    const user_id = parseInt(c.req.param("user_id"));
    if (isNaN(user_id)) return c.text("Invalid ID", 400);

    const user = await c.req.json();
    try {
        // search for the user
        const searchedUser = await getUserByIdService(user_id);
        if (searchedUser == undefined) return c.json({msg:"User not found"}, 404);
        // get the data and update it
        const res = await updateUserService(user_id, user);
        // return a success message
        if (!res) return c.json({msg:"User not updated"}, 404);

        return c.json({ msg: res }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}

//check if user is premium
export const checkUserIsPremium = async (c: Context) => {
    const user_id = parseInt(c.req.param("user_id"));
    if (isNaN(user_id)) return c.text("Invalid ID", 400);

    const isPremium = await checkIsPremium(user_id);
    return c.json({ isPremium }, 200);
}

//upgrade user to premium
export const upgradeToPremium = async (c: Context) => {
    const user_id = parseInt(c.req.param("user_id"));
    if (isNaN(user_id)) return c.text("Invalid ID", 400);

    const user = await getUserByIdService(user_id);
    if (user == undefined) {
        return c.text("User not found 😒", 404);
    }
    const res = await upgrateToPremiumService(user_id);
    return c.json({ msg: res }, 201);
}



