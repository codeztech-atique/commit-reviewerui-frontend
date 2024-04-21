import { Component, Output, EventEmitter } 		 from '@angular/core';
import appSettings from '../../config/app-settings';

@Component({
  selector: 'theme-panel',
  templateUrl: './theme-panel.component.html'
})

export class ThemePanelComponent {
	@Output() appDarkModeChanged = new EventEmitter<boolean>();
	@Output() appThemeChanged = new EventEmitter<boolean>();
	
	appSettings = appSettings;
	active = false;
	selectedTheme = 'teal';
	themes = ['red','pink','orange','yellow','lime','green','teal','cyan','blue','purple','indigo','dark'];
	
	toggle() {
		this.active = !this.active;
	}
	
	toggleTheme(theme) {
		this.appSettings.appTheme = theme;
		this.selectedTheme = theme;
		this.appThemeChanged.emit(true);
	}
	
	toggleDarkMode(e) {
		this.appSettings.appDarkMode = e.srcElement.checked;
		this.appDarkModeChanged.emit(true);
	}
	
	toggleHeaderFixed(e) {
		this.appSettings.appHeaderFixed = e.srcElement.checked;
		
		if (!e.srcElement.checked && this.appSettings.appSidebarFixed) {
			alert('Default Header with Fixed Sidebar option is not supported. Proceed with Default Header with Default Sidebar.');
			this.appSettings.appSidebarFixed = false;
		}
	}
	
	toggleHeaderInverse(e) {
		this.appSettings.appHeaderInverse = e.srcElement.checked;
	}
	
	toggleSidebarFixed(e) {
		this.appSettings.appSidebarFixed = e.srcElement.checked;
		
		if (e.srcElement.checked && !this.appSettings.appHeaderFixed) {
			alert('Default Header with Fixed Sidebar option is not supported. Proceed with Fixed Header with Fixed Sidebar.');
			this.appSettings.appHeaderFixed = true;
		}
	}
	
	toggleSidebarGrid(e) {
		this.appSettings.appSidebarGrid = e.srcElement.checked;
	}
	
	toggleGradientEnabled(e) {
		this.appSettings.appGradientEnabled = e.srcElement.checked;
	}
}
