import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let usersRepository: IUsersRepository;

describe("[Users | POST] Create user", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });
  
  it("should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      name: "John Doe",
      email: "johndoe@test.com",
      password: "123456",
    });

    expect(user).toBeDefined();
    expect(user.id).toBeDefined();
    expect(user.password).not.toBe("123456");
  });

  it("shouldn't be able to create a new user with an already used email", async () => {
    await createUserUseCase.execute({
      name: "John Doe",
      email: "johndoe@test.com",
      password: "123456",
    });

    expect(async () => createUserUseCase.execute({
      name: "John Doe",
      email: "johndoe@test.com",
      password: "123456",
    })).rejects.toBeInstanceOf(CreateUserError);
  });
    
});