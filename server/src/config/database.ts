import { DataSource } from "typeorm";
import { User } from "../entities/User";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "Sologamer",
  database: "postgres",
  synchronize: true,
  logging: true,
  entities: [User],
  migrations: [],
  subscribers: [],
});
