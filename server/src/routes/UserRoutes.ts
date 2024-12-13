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

// #region ======== [[ GET ALL USERS ]] ========
const getAllUsers: RouteHandler = async (req, res) => {
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
    id: req.query.id ? Number(req.query.id) : undefined,
    email: req.query.email as string | undefined,
    name: req.query.name as string | undefined,
  };

  try {
    // (( Get User by ID )) ----------------
    if (userRequest.id) {
      const user: IUser = await Users.findByPk(userRequest.id);
      return res.json({
        success: true,
        message: "User Fetched Successfully",
        data: user,
      } as IUserResponse);
    }

    // (( Get User by Email )) ----------------
    else if (userRequest.email) {
      const user: IUser = await Users.findOne({
        where: { email: userRequest.email },
      });
      return res.json({
        success: true,
        message: "User Fetched Successfully",
        data: user,
      } as IUserResponse);
    }

    // (( Get User by Name )) ----------------
    else if (userRequest.name) {
      const user: IUser = await Users.findOne({
        where: { name: userRequest.name },
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
    email: req.body.email,
    password: req.body.password,
    name: req.body.name,
  };

  try {
    // << CHECK IF EMAIL EXISTS >>
    if (registerRequest.email) {
      const existingUser = await Users.findOne({
        where: { email: registerRequest.email },
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
        message: "Invalid email" + ` ${registerRequest.email}`,
        error: new Error("Invalid email"),
      } as IAuthResponse);
    }

    // << CHECK IF NAME EXISTS >>
    if (registerRequest.name) {
      const existingName = await Users.findOne({
        where: { name: registerRequest.name },
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
    if (registerRequest.password) {
      const hashedPassword = await hash(registerRequest.password, 10);

      // Create new user
      const newUser = await Users.create({
        email: registerRequest.email,
        password: hashedPassword,
        name: registerRequest.name,
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
      success: true,
      message: "Login Successful",
      user: user,
      accessToken: accessToken,
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

// #region ======== [[ DELETE USER ]] ========
const deleteUser: RouteHandler = async (req, res) => {
  const userId = req.params.userId;
  if (userId) {
    await Users.destroy({ where: { id: userId } });
    res.json({ success: true, message: "User deleted successfully" } as IUserResponse);
  } else {
    res.status(400).json({ success: false, message: "Invalid user ID" } as IUserResponse);
  }
};
// #endregion

// ============================================================================ 
router.get("/", validateToken, getAuthStatus);
router.get("/auth", validateToken, getAuthStatus);
router.get("/getAll", getAllUsers);
router.get("/get", getUser);

router.post("/register", register);
router.post("/login", login);

router.delete("/:userId", validateToken, deleteUser);

export default router;
