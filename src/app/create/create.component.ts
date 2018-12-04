import { Component, OnInit } from '@angular/core';
import {DealsService} from "../deals/deals.service";

@Component({
    selector: 'app-create',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.less']
})
export class CreateComponent implements OnInit {

    form: any = {
        beneficiary: "",
        dateEnd: "",
        timeEnd: ""
    };

    waiting: Boolean = false;
    error: String = '';

    constructor(
        protected dealsService: DealsService
    ) { }

    ngOnInit() {
    }

    async create() {
        let self = this;
        await this.dealsService.setDealsRoomFactory();

        let dateEnd = new Date(this.form.dateEnd);
        if (this.form.timeEnd) {
            let hours = this.form.timeEnd.split(':')[0];
            let minutes = this.form.timeEnd.split(':')[1];
            dateEnd.setHours(hours);
            dateEnd.setMinutes(minutes);
        }

        self.waiting = true;
        this.dealsService.createDeal(this.form.beneficiary, dateEnd, 0).then((res) => {
            self.waiting = false;
        }).catch((error) => {
            self.waiting = false;
            self.error = error.message;
        });
    }

}
