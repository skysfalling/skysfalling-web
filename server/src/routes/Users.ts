import bcrypt, { hash } from "bcrypt";
import express, { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import {
  IAuthRequest,
  IAuthResponse,
  IRegisterRequest,
  IUser,
  IUserRequest,
  IUserResponse,
} from "../../../shared/types";
import { validateToken } from "../middlewares/AuthMiddleware";
import db from "../models";

const router: Router = express.Router();
const { Users } = db;

/** Defines the RouteHandler type */
type RouteHandler = (req: Request, res: Response) => Promise<any>;

// #region ======== [[ GET USERS ]] ========
const getUsers: RouteHandler = async (req, res) => {
  try {
    const users = await Users.findAll();
    res.json({
      success: true,
      message: "Users Fetched Successfully",
      data: users,
    } as IUserResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to Fetch Users",
      error: (error as Error).message,
    } as IUserResponse);
  }
};
// #endregion

// #region ======== [[ GET SINGLE USER ]] ========
const getUser: RouteHandler = async (req, res) => {
  const userRequest: IUserRequest = {
    data: {
      id: req.query.id ? Number(req.query.id) : undefined, // Convert query parameter to number if present
      email: req.query.email as string | undefined, // Cast query parameter to string
      name: req.query.name as string | undefined, // Cast query parameter to string
    },
  };

  try {
    // (( Get User by ID )) ----------------
    if (userRequest.data?.id) {
      const user: IUser = await Users.findByPk(userRequest.data.id);
      return res.json({
        success: true,
        message: "User Fetched Successfully",
        data: user,
      } as IUserResponse);
    }

    // (( Get User by Email )) ----------------
    else if (userRequest.data?.email) {
      const user: IUser = await Users.findOne({
        where: { email: userRequest.data.email },
      });
      return res.json({
        success: true,
        message: "User Fetched Successfully",
        data: user,
      } as IUserResponse);
    }

    // (( Get User by Name )) ----------------
    else if (userRequest.data?.name) {
      const user: IUser = await Users.findOne({
        where: { name: userRequest.data.name },
      });
      return res.json({
        success: true,
        message: "User Fetched Successfully",
        data: user,
      } as IUserResponse);
    }

    // (( Invalid Request )) ----------------
    else {
      return res.status(400).json({
        success: false,
        message: "Invalid request",
        error: new Error("Invalid request"),
      } as IUserResponse);
    }
  } catch (error) {
    console.error("Error getting user:", error);
    return res.status(500).json({
      success: false,
      message: (error as Error).message,
      error: error,
    } as IUserResponse);
  }
};
// #endregion

// #region ======== [[ GET AUTH STATUS ]] ========
const getAuthStatus: RouteHandler = async (req, res) => {
  try {
    if (req.user) {
      const user: IUser = {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
      };

      return res.json({
        success: true,
        message: "Authentication check successful",
        data: user,
      } as IAuthResponse);
    }
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Authentication check failed",
      error: new Error("Authentication check failed"),
    } as IAuthResponse);
  }
};
// #endregion

// #region ======== [[ REGISTER NEW USER ]] ========
const register: RouteHandler = async (req, res) => {
  const registerRequest: IRegisterRequest = {
    data: {
      email: req.body.email,
      password: req.body.password,
      name: req.body.name,
    },
  };

  try {
    // << CHECK IF EMAIL EXISTS >>
    if (registerRequest.data?.email) {
      const existingUser = await Users.findOne({
        where: { email: registerRequest.data.email },
      });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
          error: new Error("Email already exists"),
        } as IAuthResponse);
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid email" + ` ${registerRequest.data?.email}`,
        error: new Error("Invalid email"),
      } as IAuthResponse);
    }

    // << CHECK IF NAME EXISTS >>
    if (registerRequest.data?.name) {
      const existingName = await Users.findOne({
        where: { name: registerRequest.data.name },
      });
      if (existingName) {
        return res.status(400).json({
          success: false,
          message: "Name already exists",
          error: new Error("Name already exists"),
        } as IAuthResponse);
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid name",
        error: new Error("Invalid name"),
      } as IAuthResponse);
    }

    // Hash password
    if (registerRequest.data?.password) {
      const hashedPassword = await hash(registerRequest.data.password, 10);

      // Create new user
      const newUser = await Users.create({
        email: registerRequest.data.email,
        password: hashedPassword,
        name: registerRequest.data.name,
      });

      return res.json({
        success: true,
        message: "User Registered Successfully",
        data: newUser,
      } as IUserResponse);
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
        error: new Error("Invalid password"),
      } as IAuthResponse);
    }
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      success: false,
      message: "Registration failed",
      error: (error as Error).message,
    } as IAuthResponse);
  }
};
// #endregion

// #region ======== [[ LOGIN USER ]] ========
// Login user
const login: RouteHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await Users.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Could not find email",
        error: new Error("Could not find email"),
      } as IAuthResponse);
    }

    // Check password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
        error: new Error("Invalid email or password"),
      } as IAuthResponse);
    }

    // Generate JWT token
    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "1d" }
    );

    // << LOGIN SUCCESS >>
    return res.json({
      request: { email, password },
      success: true,
      message: "Login Successful",
      data: { user, accessToken },
    } as IAuthResponse);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: (error as Error).message,
    } as IAuthResponse);
  }
};
//#endregion


// ============================================================================ 
router.get("/", getUsers);
router.get("/auth", validateToken as any, getAuthStatus);
router.get("/get", getUser);
router.post("/register", register);
router.post("/login", login);

export default router;
