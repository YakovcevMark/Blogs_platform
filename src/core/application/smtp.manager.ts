import {SmtpService} from "./smpt.service";
import {inject, injectable} from "inversify";

@injectable()
export class SmtpManager {
    constructor(@inject(SmtpService) protected smtpService: SmtpService) {
    }

    public sendRegistrationCodeEmail = async (params: { email: string, code: string }) => {
        return this.smtpService.sendMail({
            to: [params.email],
            subject: 'Register',
            from: 'Blogs Platform',
            html: `<div>
           <h1>To complete the registration follow the link belown:</h1>
           <a href='https://somesite.com/confirm-email?code=${params.code}'>complete registration</a>
      </div>
`
        })
    }

}