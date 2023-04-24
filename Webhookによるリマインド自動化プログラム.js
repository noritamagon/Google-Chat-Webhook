//Webhookを設定し、Google Chatへのリマインドbotを作成する

function remind_bot(){

    //シートの定義
    var SHEET_NAME="読み込むシートの名前";
    //行の定義
    var ROW_REMIND_START=2;

    //列の定義
    var COL_REMIND_MENTION=2;
    var COL_REMIND_MESSAGE=3;
    var COL_REMIND_SPACE=4;
    var COL_REMIND_WEBHOOK=5;
    var COL_REMIND_THREAD=6;
    var COL_REMIND_DEADLINE=7;

    //シートを取得
    var ss=SpreadSheetApp.getActiveSpreadsheet();
    var sh=ss.getSheetByName(SHEET_NAME);

    //データの最終行を取得
    var ROW_REMIND_LAST=sh.getLastRow();

    //今日の日付を取得
    var today=Utilities.formatDate(new Date(),"JST","yyyy/M/dd");


    //リマインドの登録分だけループ実行
    for(var r=ROW_REMIND_START;r<=sh.getLastRow();r++){

        //リマインド日を確認する
        var AlertDay=sh.getRange(r,COL_REMIND_DEADLINE).getValue();
        
        //AlertDayが空の行に到達したら処理を終了する
        if(AlertDay==""){
            break;
        }

        var AlertDay=Utilities.formatDate(AlertDay,"yyyy/M/dd");

        //締切日かどうか確認
        if(AlertDay==today){

            //データ取得し実行準備
            var Oppoment=sh.getRange(r,COL_REMIND_MENTION).getValue();
            var Message=sh.getRange(r,COL_REMIND_MESSAGE).getValue();
            var SpaceName=sh.getRange(r,COL_REMIND_SPACE).getValue();
            var Webhook=sh.getRange(r,COL_REMIND_WEBHOOK).getValue();
            var ThreadID=sh.getRange(r,COL_REMIND_THREAD).getValue();

            //投稿用リマインドメッセージを作成
            var text=Oppoment+"\n"+Message;

            //スレッドがない場合、スレッドを指定しない投稿処理を行う
            if(ThreadID=="" || ThreadID=="-"){

                var payload={
                    "text":text,
                };
            //スレッドありの場合
            }else{
                var payload={
                    "text":text,
                    "thread":{
                        "name":ThreadID
                    }
                };

            }

            //textをJSON形式に変換
            var json=JSON.stringify(payload);

            var options={
                "method":"POST",
                "contentType":"application/json; charset=utf-8",
                "payload":json
            };

            //送信実行
            var response=UrlFetchApp.fetch(Webhook,options);
        }
    }
}