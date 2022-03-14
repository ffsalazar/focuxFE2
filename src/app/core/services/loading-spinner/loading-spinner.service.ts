import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingSpinnerService {

  private _isLoading: Subject<boolean> = new Subject();

    constructor() { }

	/**
	 * 
	 * 
	 */
    get _isLoading$() {
      return this._isLoading.asObservable();
    }

	/**
	 * Starting loading
	 * 
	 */
	startLoading() {
		this._isLoading.next(true);
	}

	/**
	 * Stop loading
	 * 
	 */
	stopLoading() {
		setTimeout(() => {
			this._isLoading.next(false);
		}, 1500)
	}


}
