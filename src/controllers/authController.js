import Moralis from "moralis";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

const messageConfig = {
  // domain i uri moraju biti u skladu sa frontendom, odnosno ne mogu ovdje označiti url gdje vite hosta ne networku (http://192.168.1.107:5173) a potpisati message sa localhost-a
  domain: process.env.APP_DOMAIN,
  statement: "Please sign this message to confirm your identity.",
  uri: process.env.APP_URI,
  timeout: 60,
};

// @desc request message to be signed by client
// @route POST /auth/request-message

export const ethMessage = asyncHandler(async (req, res) => {
  // console.log("sadržaj request body: ", req.body);
  const { address, chain, network } = req.body;
  console.log("request message api connected");

  try {
    const message = await Moralis.Auth.requestMessage({
      address,
      chain,
      ...messageConfig,
    });

    res.status(200).json(message);
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.error(error);
  }
});

// @desc verify signature.
// obicno provjera ako je javni ključ dobiveni iz funkcije koja prima message i signature isti kao javni ključ kornisnika
// vjerojatno Moralis radi u pozadini nešto slično.. barem se nadam
// @route POST /auth/verify
export const ethVerify = asyncHandler(async (req, res) => {
  try {
    const { message, signature } = req.body;

    const { address, profileId } = (
      await Moralis.Auth.verify({
        message,
        signature,
        networkType: "evm",
      })
    ).raw;

    const user = { address, profileId, signature };

    // create JWT token
    const token = jwt.sign(user, process.env.AUTH_SECRET);

    // set JWT cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    console.log("user objekt", user);

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.error(error);
  }
});

// @desc deletes jwt cookie from client
// @route GET /auth/logout
// @ts-ignore -> buni se da ne koristim req
export const logout = asyncHandler(async (req, res) => {
  try {
    res.clearCookie("jwt", {
      sameSite: "none",
      secure: true,
    });
    return res.sendStatus(200);
  } catch {
    return res.sendStatus(403);
  }
});
