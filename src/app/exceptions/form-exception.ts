import { forEach } from '@angular/router/src/utils/collection';

export class FormException {
    private errors: any;
    
    constructor(errors: any) {
        this.errors = errors
    }

    public getMessage()
    {
        let errorMessages = [];

        this.errors.forEach(error => {
            errorMessages.push(error.message)
        })

        return errorMessages.join(" <br/> ");
    }
}