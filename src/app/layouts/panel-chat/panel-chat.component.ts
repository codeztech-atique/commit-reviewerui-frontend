import { Component, ViewChild, AfterViewInit } 		 from '@angular/core';

@Component({
  selector: 'panel-chat',
  inputs: ['title', 'variant', 'noBody', 'noButton', 'headerClass', 'bodyClass', 'footerClass', 'panelClass'],
  templateUrl: './panel-chat.component.html'
})

export class PanelChatComponent implements AfterViewInit {
  @ViewChild('panelFooter', { static: false }) panelFooter;
  expand = false;
  reload = false;
  collapse = false;
  remove = false;
  showFooter = false;
  
  constructor() {
    // console.log("I am calling.")
  }
  
  ngAfterViewInit() {
    setTimeout(() => {
      this.showFooter = (this.panelFooter) ? this.panelFooter.nativeElement && this.panelFooter.nativeElement.children.length > 0 : false;
    });
  }

  panelExpand() {
    this.expand = !this.expand;
    var items:any = document.getElementsByClassName('chat-spinner-position');
    if(this.expand) {
      for (let i = 0; i < items.length; i++) {
          let element = items[i];
          element.style.position = "fixed";
          element.style.bottom = `20rem`;
          element.style.right = `35rem`;
      }
      
      var getEmoji:any = document.getElementsByClassName('emoji-style');
      console.log('Emoji:', getEmoji);
      for (let i = 0; i < getEmoji.length; i++) {
        let element = getEmoji[i];
        element.style.bottom = `6rem`;
      }
    } else {
      console.log('I am going inside');
      for (let i = 0; i < items.length; i++) {
        let element = items[i];
        element.style.position = "fixed";
        element.style.bottom = `20rem`;
        element.style.right = `20rem`;
      }
    }
  }
  panelReload() {
    this.reload = true;
    
    setTimeout(() => {
      this.reload = false;
    }, 1500);
  }
  panelCollapse() {
    this.collapse = !this.collapse;
  }
  panelRemove() {
    this.remove = !this.remove;
  }
}
