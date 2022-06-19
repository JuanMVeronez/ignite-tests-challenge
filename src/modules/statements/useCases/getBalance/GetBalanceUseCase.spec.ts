import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "src/modules/users/repositories/IUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { GetBalanceUseCase } from "./GetBalanceUseCase";
import { GetBalanceError } from "./GetBalanceError";

let getBalanceUseCase: GetBalanceUseCase;
let statementsRepository: IStatementsRepository;
let usersRepository: IUsersRepository;

describe("[Balance | GET] Get Balance", () => {
  beforeEach(() => {
    statementsRepository = new InMemoryStatementsRepository();
    usersRepository = new InMemoryUsersRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      statementsRepository,
      usersRepository
    );
  });

  it("should be able to get balance", async () => {
    const user = await usersRepository.create({
      name: "John Doe",
      email: "johndoe@test.com",
      password: "12345678",
    });

    const response = await getBalanceUseCase.execute({ user_id: user.id });

    expect(response).toBeDefined();
    expect(response.balance).toBe(0);
    expect(response.statement.length).toBe(0);
  });

  it("shouldn't be able to get balance with invalid user id", async () => {
    expect(async () => getBalanceUseCase.execute({ user_id: "invalid-id" }))
      .rejects.toBeInstanceOf(GetBalanceError);
  });
});