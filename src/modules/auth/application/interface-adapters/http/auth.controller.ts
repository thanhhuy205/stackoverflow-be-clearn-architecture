import { AuthPresenter } from "@/modules/auth/application/interface-adapters/presenters/auth.presenter";
import { RegisterUseCase } from "@/modules/auth/application/use-cases/register.use-case";
import { Request, Response } from "express";

export class AuthController {
    constructor(private readonly registerUseCase: RegisterUseCase,
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
}