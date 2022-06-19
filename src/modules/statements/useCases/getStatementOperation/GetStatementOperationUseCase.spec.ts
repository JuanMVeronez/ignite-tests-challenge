import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "src/modules/users/repositories/IUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";

let usersRepository: IUsersRepository;
let statementsRepository: IStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("[statement | GET] Get Statement Operation", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      usersRepository,
      statementsRepository
    );
  });

  it("should be able to get statement operation by id", async () => {
    const user = await usersRepository.create({
      name: "John Doe",
      email: "johndoe@test.com",
      password: "12345678",
    });

    const statement = await statementsRepository.create({
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "Deposit",
    });
    
    const response = await getStatementOperationUseCase.execute({
      statement_id: statement.id,
      user_id: user.id,
    });
  
    expect(response).toBeDefined();
    expect(response).toHaveProperty("id");
    expect(response.user_id).toBe(user.id);
    expect(response.id).toBe(statement.id);
  });

  it("shouldn't be able to get statement with invalid user id", async () => {
    const user = await usersRepository.create({
      name: "John Doe",
      email: "johndoe@test.com",
      password: "12345678",
    });

    const statement = await statementsRepository.create({
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "Deposit",
    });
    
    expect(async () => getStatementOperationUseCase.execute({
      user_id: "invalid-id",
      statement_id: statement.id,
    })).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("shouldn't be able to get statement with invalid statement id", async () => {
    const user = await usersRepository.create({
      name: "John Doe",
      email: "johndoe@test.com",
      password: "12345678",
    });

    expect(async () => getStatementOperationUseCase.execute({
      user_id: user.id,
      statement_id: "invalid-id",
    })).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});