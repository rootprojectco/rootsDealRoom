import { Component, OnInit } from '@angular/core';
import {DealsService} from '../deals/deals.service';
import {Router} from "@angular/router";

@Component({
    selector: 'app-create',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.less']
})
export class CreateComponent implements OnInit {

    form: any = {
        beneficiary: '',
        dateEnd: '',
        timeEnd: '',
        amount: ''
    };

    waiting = false;
    error = '';

    constructor(
        protected dealsService: DealsService,
        private router: Router
    ) { }

    ngOnInit() {
        console.log('CREATE init');
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
        this.dealsService.createDeal(this.form.beneficiary, dateEnd, this.form.amount).then((res) => {
            console.log('CREATE', res);

            const dealRoomAddress = self.getdealRoomFromLogs(res);
            if (dealRoomAddress) {
                this.router.navigate(['/address/' + dealRoomAddress]);
            } else {
                this.router.navigate(['/']);
            }
        }).catch((error) => {
            self.waiting = false;
            self.error = error.message;
        });
    }

    private getdealRoomFromLogs(res) {
        if (res && res.logs) {
            let dealRoom = false;
            for (const i in res.logs) {
                if (
                    res.logs[i] && res.logs[i].hasOwnProperty('event') && res.logs[i]['event'] === 'DealRoomCreated' &&
                    res.logs[i].hasOwnProperty('args') && res.logs[i]['args'].hasOwnProperty('dealRoom')
                ) {
                    dealRoom = res.logs[i]['args']['dealRoom'];
                }
            }

            return dealRoom;
        } else {
            return false;
        }
    }

}
