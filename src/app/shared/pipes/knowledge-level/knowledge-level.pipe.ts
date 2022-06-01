import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'knowledgeLevel'
})
export class KnowledgeLevelPipe implements PipeTransform {

	transform(value: number): string {

		let knowledgeLevel: string = "";

		switch (value) {

			case 1: {
				knowledgeLevel = "Trainee";
				break;
			}

			case 2: {
				knowledgeLevel = "Junior";
				break;
			}

			case 3: {
				knowledgeLevel = "Semi-Senior";
				break;
			}

			case 4: {
				knowledgeLevel = "Senior";
				break;
			}
		}
		return knowledgeLevel;
	}

}
