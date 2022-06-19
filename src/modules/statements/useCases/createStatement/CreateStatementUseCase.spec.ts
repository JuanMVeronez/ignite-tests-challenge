import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "src/modules/users/repositories/IUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

import { OperationType } from "../../entities/Statement";
import { CreateStatementError } from "./CreateStatementError";

let createStatementUseCase: CreateStatementUseCase;
let usersRepository: IUsersRepository;
let statementsRepository: IStatementsRepository;

describe("[deposit/withdraw | POST] Create Statement", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      usersRepository,
      statementsRepository
    );
  });

  it("should be able to create a new deposit", async () => {
    const user = await usersRepository.create({
      name: "John Doe",
      email: "johndoe@test.com",
      password: "12345678",
    });

    const response = await createStatementUseCase.execute({
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "Deposit",
    });

    expect(response).toBeDefined();
    expect(response).toHaveProperty("id");
    expect(response.type).toBe(OperationType.DEPOSIT);
    expect(response.amount).toBe(100);
    expect(response.description).toBe("Deposit");  
  });

  it("should be able to create a new withdraw", async () => {
    const user = await usersRepository.create({
      name: "John Doe",
      email: "johndoe@test.com",
      password: "12345678",
    });

    await createStatementUseCase.execute({
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "Deposit",
    });

    const response = await createStatementUseCase.execute({
      user_id: user.id,
      type: OperationType.WITHDRAW,
      amount: 100,
      description: "Withdraw",
    });

    expect(response).toBeDefined();
    expect(response).toHaveProperty("id");
    expect(response.type).toBe(OperationType.WITHDRAW);
    expect(response.amount).toBe(100);
    expect(response.description).toBe("Withdraw");
  });

  it("shouldn't be able to create a new statement with an invalid user id", async () => {
    expect(async () =>
      createStatementUseCase.execute({
        user_id: "invalid-id",
        type: OperationType.DEPOSIT,
        amount: 100,
        description: "Invalid Deposit",
      })
    ).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("shouldn't be able to withdraw with insufficient funds", async () => {
    const user = await usersRepository.create({
      name: "John Doe",
      email: "johndoe@test.com",
      password: "12345678",
    });

    expect(
      async () => createStatementUseCase.execute({
        user_id: user.id,
        type: OperationType.WITHDRAW,
        amount: 1000,
        description: "Withdraw without funds",
      })
    ).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  })
});