import { defineStore } from 'pinia';


//  派发 v-permiss指令控制鉴权  （打算存到数据库）
export const usePermissStore = defineStore('permiss', {
	state: () => {
		const keys = localStorage.getItem('role');
		return {
			key: keys ? JSON.parse(keys) : <string[]>[],
			defaultList: {
				admin: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'],
				user: ['1', '2', '3', '11', '13', '14', '15']
			}
		};
	},
	actions: {
		handleSet(val: string[]) {
			this.key = val;
		}
	}
});
