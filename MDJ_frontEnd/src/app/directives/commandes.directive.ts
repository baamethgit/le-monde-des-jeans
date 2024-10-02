import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { Commande } from '../models/commande';

export interface SortEvent {
	column: SortColumn;
	direction: SortDirection;
}


export type SortColumn = keyof Commande | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = { asc: 'desc', desc: '', '': 'asc' };



@Directive({
  selector: '[appCommandes]',
  standalone: true,
  // selector: 'th[sortable]',
	host: {
		'[class.asc]': 'direction === "asc"',
		'[class.desc]': 'direction === "desc"',
		'(click)': 'rotate()',
	},
})
export class CommandesDirective {//NgbdSortableHeader
	@Input() sortable: SortColumn = '';
	@Input() direction: SortDirection = '';
	@Output() sort = new EventEmitter<SortEvent>();

	rotate() {
		this.direction = rotate[this.direction];
		this.sort.emit({ column: this.sortable, direction: this.direction });
	}
}
