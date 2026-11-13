"use server";

import demoAccounts from "@/app/data/demo-accounts.json";

type DemoAccount = {
  email: string;
  password: string;
  name: string;
};

export type LoginResult =
  | { success: true; email: string; name: string }
  | { success: false; message: string };

export async function authenticateDemoAccount(
  email: string,
  password: string,
): Promise<LoginResult> {
  const normalizedEmail = email.trim().toLowerCase();
  const account = (demoAccounts as DemoAccount[]).find(
    (candidate) =>
      candidate.email.toLowerCase() === normalizedEmail &&
      candidate.password === password,
  );

  if (!account) {
    return {
      success: false,
      message: "The email or password does not match a demo account.",
    };
  }

  return {
    success: true,
    email: account.email,
    name: account.name,
  };
}
