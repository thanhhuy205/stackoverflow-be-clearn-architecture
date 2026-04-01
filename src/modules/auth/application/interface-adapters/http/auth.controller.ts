import { AuthPresenter } from "@/modules/auth/application/interface-adapters/presenters/auth.presenter";
import { LoginUseCase } from "@/modules/auth/application/use-cases/login.use-case";
import { RegisterUseCase } from "@/modules/auth/application/use-cases/register.use-case";
import { Request, Response } from "express";

export class AuthController {
    constructor(private readonly registerUseCase: RegisterUseCase,
        private readonly loginUseCase: LoginUseCase,
        private readonly authPresenter: AuthPresenter
    ) {
    }
    register = async (req: Request, res: Response) => {
        const output = await this.registerUseCase.execute({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword
        });

        const data = this.authPresenter.presentRegisteredUser(output);

        return res.success(data, 201, 'Register successfully');
    }

    login = async (req: Request, res: Response) => {
        const output = await this.loginUseCase.execute({
            email: req.body.email,
            password: req.body.password
        })

        const data = this.authPresenter.presentLoginUser(output);

        return res.success(data, 200, "Login successfully");

    }
}