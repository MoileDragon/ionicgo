import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController,Events } from 'ionic-angular';
import { AlertProvider } from '../../providers/alert/alert';
import firebase from 'firebase/app';

/**
 * Generated class for the WithdrawPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-withdraw',
  templateUrl: 'withdraw.html',
})
export class WithdrawPage {

  withdraws = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,public dataProvider : AlertProvider,public alertCtrl:AlertController,public events:Events) {
    this.withdraws = [];
    this.dataProvider.getWithdraws(this.withdraws);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WithdrawPage');
  }


  register(withdraw){
    this.dataProvider.getOneWithdraw(withdraw);
    var indexDate = [];
    var userInfo = [];
    this.dataProvider.returnKeyWithdraw(indexDate);
    this.dataProvider.whenWithdrawGetUser(userInfo);
    console.log("-------------userInfo---------------" + userInfo);
    var withdrawedTotoalGo =  parseFloat(userInfo[0].GO.totoalGO) - parseFloat(withdraw.amount);
    var withdrawedAvaialbleGo = parseFloat(userInfo[0].GO.availableGO) - parseFloat(withdraw.amount);
    
    firebase.database().ref().child('/user/' + indexDate[0] + '/GO/'+indexDate[1]).update({

      state_complete : '1',


    }).then(function() {
      // Update successful.

      firebase.database().ref().child('/user/' + indexDate[0] + '/GO').update({

        totoalGO : withdrawedTotoalGo,
        availableGO : withdrawedAvaialbleGo,


      });
      // Remove the record of registerd users in  the notification/sign 

        firebase.database().ref().child('/notification/withdraw/'+withdraw.key).remove().then(function() {
          console.log("SUCCESS");
         
          var hidden = document.getElementById(withdraw.key);
          hidden.innerHTML = "Withdrawed";

        // this.dataProvider.returnNumbersOfValue(this.numberOfValues);

        });


    }, function(error) {
      // An error happened.
      console.log(error);
    });
    var tempLength =[];
    this.dataProvider.getWithdrawslength(tempLength);
    console.log(tempLength);
    this.events.publish('user:withdraw',tempLength);
    var availableGos = [];
    this.dataProvider. getVariousTypeGo(availableGos);
    this.events.publish('user:avaialbeGos',availableGos);

  }

}
