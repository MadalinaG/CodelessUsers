import { FormGroup } from '@angular/forms';

// custom validator to check that two fields match
export function MyDepartmentAgeValidator(birthDay: string, depSelected: string) {
    return (formGroup: FormGroup) => {
        const birthDayControl = formGroup.controls[birthDay];
        const departmentControl = formGroup.controls[depSelected];

        if (Array.isArray(departmentControl.value)) {
            const depName = departmentControl.value[0].name;

            var currentDate = new Date();
            var year = currentDate.getFullYear();
            var month = currentDate.getMonth();
            var day = currentDate.getDate();
            var codelessRestrictionDate = new Date(year - 20, month, day)
            var codeMoreRestrictionDate = new Date(year - 24, month, day)
        
            if (depName == "Codeless" && birthDayControl.value > codelessRestrictionDate) {
                birthDayControl.setErrors({ myDepartmentAgeValidatorCodeless: true });
            } else {

                if (depName == "Codemore" && birthDayControl.value > codeMoreRestrictionDate) {
                    birthDayControl.setErrors({ myDepartmentAgeValidatorCodemore: true });
                } else {
                    birthDayControl.setErrors(null);
                }
            }
        }
    }
}

