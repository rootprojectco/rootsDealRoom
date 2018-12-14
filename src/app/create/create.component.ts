import { Component, OnInit } from '@angular/core';
import {DealsService} from '../deals/deals.service';

@Component({
    selector: 'app-create',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.less']
})
export class CreateComponent implements OnInit {

    form: any = {
        beneficiary: '',
        dateEnd: '',
        timeEnd: ''
    };

    waiting = false;
    error = '';

    constructor(
        protected dealsService: DealsService
    ) { }

    ngOnInit() {
    }

    async create() {
        const self = this;
        await this.dealsService.setDealsRoomFactory();

        const dateEnd = new Date(this.form.dateEnd);
        if (this.form.timeEnd) {
            const hours = this.form.timeEnd.split(':')[0];
            const minutes = this.form.timeEnd.split(':')[1];
            dateEnd.setHours(Number(hours));
            dateEnd.setMinutes(Number(minutes));
        }

        self.waiting = true;
        this.dealsService.createDeal(this.form.beneficiary, dateEnd).then((res) => {
            self.waiting = false;
        }).catch((error) => {
            self.waiting = false;
            self.error = error.message;
        });
    }

}
