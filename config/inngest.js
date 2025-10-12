import { Inngest } from "inngest";
import connectDB from "./db";
import UserModel from "../model/user.model";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "recipeai-next" });

//inngest fujnc to save usr to db

export const syncUserCreate = inngest.createFunction(
  {
    id: "sync-user-from-clerk",
  },
  {
    event: "clerk/user.created",
  },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses } = event.data;
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: first_name + " " + last_name,
    };
    await connectDB();
await UserModel.create(userData);
  }
);

// 🧩 Function: update user in DB when Clerk user is updated
export const syncUserUpdate = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses } = event.data;

    const updatedData = {
      email: email_addresses[0]?.email_address,
      name: `${first_name || ""} ${last_name || ""}`.trim(),
    };

    await connectDB();
    await UserModel.findByIdAndUpdate(id, updatedData, { new: true });
  }
);

// 🧩 DELETE — Remove user from DB when Clerk user is deleted
export const syncUserDelete = inngest.createFunction(
  { id: "delete-user-from-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { id } = event.data;

    await connectDB();
    await UserModel.findByIdAndDelete(id);
  }
);