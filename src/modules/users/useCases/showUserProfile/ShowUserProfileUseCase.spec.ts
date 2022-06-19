import { User } from "../../entities/User";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let usersRepository: IUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("[Profile | GET] Show User Profile", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);
  });

  it("should be able to show user profile", async () => {
    const user = await usersRepository.create({
      name: "John Doe",
      email: "johndoe@test.com",
      password: "12345678",
    });

    const response = await showUserProfileUseCase.execute(user.id);
    expect(response).toBeDefined();
    expect(response).toBeInstanceOf(User);
  });

  it("shouldn't be able to show user profile with invalid id", async () => {
    expect(
      async () => showUserProfileUseCase.execute("invalid-id")
    ).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});