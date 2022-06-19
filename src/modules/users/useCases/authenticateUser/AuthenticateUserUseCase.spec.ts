import { hash } from "bcryptjs";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepository: IUsersRepository;

describe("[Authentication | POST] Authenticate User", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
  });

  it("should be able to authenticate a user", async () => {
    const password = await hash("test", 8)
    await usersRepository.create({
      name: "John Doe",
      email: "johndoe@test.com",
      password,
    });

    const response = await authenticateUserUseCase.execute({
      email: "johndoe@test.com",
      password: "test",
    });

    expect(response).toBeDefined();
    expect(response).toHaveProperty("token");
  });

  it("shouldn't be able to authenticate a user with an incorrect email", async () => {	
    const password = await hash("test", 8)
    await usersRepository.create({
      name: "John Doe",
      email: "johndoe@test.com",
      password,
    });

    expect(async () => authenticateUserUseCase.execute({
      email: "johndoe@wrong-email.com",
      password: "test",
    })).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("shouldn't be able to authenticate a user with an invalid password", async () => {
    const password = await hash("test", 8)
    await usersRepository.create({
      name: "John Doe",
      email: "johndoe@test.com",
      password,
    });

    expect(async () => authenticateUserUseCase.execute({
      email: "johndoe@test.com",
      password: "wrong-password",
    })).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});