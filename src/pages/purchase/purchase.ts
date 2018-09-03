import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController,Events } from 'ionic-angular';
import { AlertProvider } from '../../providers/alert/alert';
import firebase from 'firebase/app';

/**
 * Generated class for the PurchasePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-purchase',
  templateUrl: 'purchase.html',
})
export class PurchasePage {

  purchases = [];

    constructor(public navCtrl: NavController, public navParams: NavParams,public dataProvider : AlertProvider,public alertCtrl:AlertController,public events:Events) {
    this.purchases = [];
    this.dataProvider.getPurchases(this.purchases);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PurchasePage');
  }


  register(purchase){

      this.dataProvider.getOnePurchase(purchase);
      var indexDate = [];
      var userInfo = [];
      this.dataProvider.returnKeyPurchase(indexDate);
      this.dataProvider.whenPurchaseGetUser(userInfo);
      console.log("-------------userInfo---------------" + userInfo);
      var purchasedTotoalGo =  parseFloat(userInfo[0].GO.totoalGO) + parseFloat(purchase.amount);
     
      var indexGo = indexDate[1];
      console.log(indexGo);

      firebase.database().ref().child('/user/' + indexDate[0] + '/GO/'+indexGo).update({

          state_complete : '1',
  
  
        }).then(function() {
          // Update successful.
         

          firebase.database().ref().child('/user/' + indexDate[0] + '/GO').update({

            totoalGO : purchasedTotoalGo,
    
    
          });

          // Remove the record of registerd users in  the notification/sign 
            firebase.database().ref().child('/notification/purchase/'+purchase.key).remove().then(function() {
              console.log("SUCCESS");
             
              var hidden = document.getElementById(purchase.key);
              hidden.innerHTML = "Purchased";

            });

  
        }, function(error) {
          // An error happened.
          console.log(error);
        });

        var tempLength =[];
        this.dataProvider.getPurchaseslength(tempLength);
        this.events.publish('user:purchase',tempLength);
        var purchasedGos = [];
        this.dataProvider. getVariousTypeGo(purchasedGos);
        this.events.publish('user:purchaseGos',purchasedGos);
  }

}
