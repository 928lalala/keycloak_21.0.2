import type RealmRepresentation from "@keycloak/keycloak-admin-client/lib/defs/realmRepresentation";
import {
  ActionGroup,
  AlertVariant,
  Button,
  ButtonVariant,
  FormGroup,
  InputGroup,
  InputGroupText,
  PageSection,
  Select,
  SelectOption,
  SelectVariant,
  Text,
  TextContent
} from "@patternfly/react-core";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useAlerts } from "../../components/alert/Alerts";
import { FormAccess } from "../../components/form-access/FormAccess";
import { HelpItem } from "ui-shared";
import { KeycloakTextInput } from "../../components/keycloak-text-input/KeycloakTextInput";
import { useAdminClient } from "../../context/auth/AdminClient";
import { useRealm } from "../../context/realm-context/RealmContext";
import { convertFormValuesToObject, convertToFormValues } from "../../util";

import { FormPanel } from "../../components/scroll-form/FormPanel";

import { useConfirmDialog } from "../../components/confirm-dialog/ConfirmDialog";

import "./autootp-policy.css";

const AUTOOTP_AUTHENTICATION_STEP = ["1step", "2step"] as const;


const CIBA_BACKHANNEL_TOKEN_DELIVERY_MODES = ["poll", "ping"] as const;
const CIBA_EXPIRES_IN_MIN = 10;
const CIBA_EXPIRES_IN_MAX = 600;
const CIBA_INTERVAL_MIN = 0;
const CIBA_INTERVAL_MAX = 600;

type AutoOTPPolicyProps = {
  realm: RealmRepresentation;
  realmUpdated: (realm: RealmRepresentation) => void;
};

type FormFields = Omit<
  RealmRepresentation,
  "clients" | "components" | "groups"
>;

export const AutoOTPPolicy = ({ realm, realmUpdated }: AutoOTPPolicyProps) => {
  const { t } = useTranslation("authentication");
  const {
    control,
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isValid, isDirty },
  } = useForm<FormFields>({ mode: "onChange" });
  const { adminClient } = useAdminClient();
  const { realm: realmName } = useRealm();
  const { addAlert, addError } = useAlerts();
  const [
    autootpAppSettingStepOpen,
    setAutootpAppSettingStepOpen,
  ] = useState(false);


  const [isBtnApplicationSettingSave, setIsBtnApplicationSettingSave] = useState<boolean>(false);

  const [isBtnserverProgressReload, setIsBtnserverProgressReload] = useState<boolean>(true);
  const [isBtnresendRegistrationEmail, setIsBtnresendRegistrationEmail] = useState<boolean>(true);
  const [isBtnresendSetupFileEmail, setIsBtnresendSetupFileEmail] = useState<boolean>(true);

  const [isTextautootpServerSettingAppServerKey, setIsTextautootpServerSettingAppServerKey] = useState<boolean>(true);
  const [isTextautootpServerSettingAuthServerDomain, setIsTextautootpServerSettingAuthServerDomain] = useState<boolean>(true);

  const [isBtnApplicationServerSave, setIsBtnApplicationServerSave] = useState<boolean>(true);
  const [isBtnApplicationServerClear, setIsBtnApplicationServerClear] = useState<boolean>(true);


  



  const setupForm = (realm: RealmRepresentation) =>
    convertToFormValues(realm, setValue);

  useEffect(() => {
    setupForm(realm);

    const autootpReturnDomainValidationToken = getValues("attributes.autootpReturnDomainValidationToken"); 
    const autootpReturnServerProgressStatus = getValues("attributes.autootpReturnServerProgressStatus"); 
    const autootpServerSettingAppServerKey = getValues("attributes.autootpServerSettingAppServerKey"); 
    const autootpServerSettingAuthServerDomain = getValues("attributes.autootpServerSettingAuthServerDomain"); 

    console.log("useEffect==============>");   
    console.log("autootpReturnDomainValidationToken===>", autootpReturnDomainValidationToken);   
    console.log("autootpReturnDomainValidationToken != undefined===>", (autootpReturnDomainValidationToken != undefined));   
    console.log("autootpReturnDomainValidationToken.length===>", (autootpReturnDomainValidationToken.length));   
    console.log("autootpReturnServerProgressStatus===>", autootpReturnServerProgressStatus);   
    console.log("autootpReturnServerProgressStatus != undefined===>", (autootpReturnServerProgressStatus != undefined));   
    console.log("autootpReturnServerProgressStatus.length===>", (autootpReturnServerProgressStatus.length));   
  // setIsBtnApplicationSettingSave(false);

  // setIsBtnserverProgressReload(true);
  // setIsBtnresendRegistrationEmail(true);
  // setIsBtnresendSetupFileEmail(true);

  // setIsTextautootpServerSettingAppServerKey(true);
  // setIsTextautootpServerSettingAuthServerDomain(true);

  // setIsBtnApplicationServerSave(true);
  // setIsBtnApplicationServerClear(true);
	if(autootpReturnDomainValidationToken != undefined && autootpReturnDomainValidationToken.length > 0) { 
    //	$scope.autootpAppSettingStepDisable = true;
      setIsBtnApplicationSettingSave(true);
      setIsBtnserverProgressReload(false);
    } else { 
      setIsBtnApplicationSettingSave(false);
      setIsBtnserverProgressReload(true);
    }  
  
  setIsBtnresendRegistrationEmail(true);
  setIsBtnresendSetupFileEmail(true);
  
  setIsTextautootpServerSettingAppServerKey(true);
  setIsTextautootpServerSettingAuthServerDomain(true);
  
  setIsBtnApplicationServerSave(true);
  setIsBtnApplicationServerClear(true); 

  if(autootpReturnServerProgressStatus != undefined && autootpReturnServerProgressStatus.length > 0) {
      switch(autootpReturnServerProgressStatus){
        case "01" :
          setIsBtnresendRegistrationEmail(false);
          setIsBtnresendSetupFileEmail(true);
          break;
        
        case "02" :
          setIsBtnresendRegistrationEmail(true);
          setIsBtnresendSetupFileEmail(true);
          break;
  
        case "10" :
          setIsBtnserverProgressReload(true);
          setIsBtnresendRegistrationEmail(true);
          setIsBtnresendSetupFileEmail(false);
          setIsTextautootpServerSettingAppServerKey(false);
          setIsTextautootpServerSettingAuthServerDomain(false);
          setIsBtnApplicationServerSave(false);
          setIsBtnApplicationServerClear(false); 
          break;
        default :
          setIsBtnresendRegistrationEmail(true);
          setIsBtnresendSetupFileEmail(true);
          break;
                
      } 
  
    } else {
      setIsBtnresendRegistrationEmail(true);
      setIsBtnresendSetupFileEmail(true);
      
    }
  
  // setIsBtnApplicationServerSave(true);
  // setIsBtnApplicationServerClear(true);  
      
  // if((autootpServerSettingAppServerKey != undefined && autootpServerSettingAppServerKey.length > 0) ||
  //     (autootpServerSettingAuthServerDomain != undefined && autootpServerSettingAuthServerDomain.length > 0)) { 
  //       setIsBtnApplicationServerSave(false);
  //       setIsBtnApplicationServerClear(false);
  //   }else{
  //     setIsBtnApplicationServerSave(true);
  //     setIsBtnApplicationServerClear(true);
  //   }

  }, []);

	/////////////////////////////////////////////
	// API TEST
	const [usersfetchs, setUsersfetchs] = useState([]);
	// API TEST
	/////////////////////////////////////////////


  const onDeleteSubmit = async (formValues: FormFields) => {
    try {
      console.log('onDelete - formValues:', formValues)
      console.log('onDelete - realmName:', realmName)
      formValues.attributes = undefined;
      console.log('attributes:')
      console.log(formValues.attributes)

      //setIsTextValue1('');
      //setIsTextValue2('');
      // formValues.attributes.autootpAppSettingName = undefined;
      // <formValues className="attributes"></formValues>


      await adminClient.realms.update(
        { realm: realmName },
        convertFormValuesToObject(formValues)
        );
        
        const updatedRealm = await adminClient.realms.findOne({
          realm: realmName,
          
        });
      realmUpdated(updatedRealm!);
      setupForm(updatedRealm!);
      addAlert(t("updateAutoOTPSuccess"), AlertVariant.success);
      window.location.reload();
      
    } catch (error) {
      addError("authentication:updateAutoOTPError", error);
    } finally {
      // window.document.getElementById('autootpAppSettingName')?.value ?? null;
    }
  };





  const onDelete = async (formValues: FormFields) => {
    
    // if(!confirm("All registered contents will be deleted.\nAre you sure you want to delete it?")){
    //   return;
    // }

    try {
      console.log('onDelete');
      console.log('경고 메시지 알럿 후 Y/N 버튼');
      console.log('Delete API 통신');
      console.log('API 통신 성공 시 모든 항목값 공백처리 후 DB저장');
      
    
      
      console.log('realmName:'+realmName);
      console.log('------------realm ------------:');
      console.log(realm);

      // setValue("attributes.autootpAppSettingStep",undefined);
      // setValue("attributes.autootpAppSettingName",undefined);
      // setValue("attributes.autootpAppSettingDomain",undefined);
      // setValue("attributes.autootpAppSettingIpAddress",undefined);
      // setValue("attributes.autootpAppSettingProxyServerDomain",undefined);
      // setValue("attributes.autootpAppSettingEmail",undefined);
      // setValue("attributes.autootpReturnDomainValidationToken",undefined);
      // setValue("attributes.autootpReturnServerProgress",undefined);
      // setValue("attributes.autootpReturnServerProgressStatus",undefined);
      // setValue("attributes.autootpServerSettingAppServerKey",undefined);
      // setValue("attributes.autootpServerSettingAuthServerDomain",undefined);

//      setIsSubmitCompleted(false);


      let paramStr = "/auth/realms/master/protocol/openid-connect/autootp-policy-api"; // master로 저장됨
      let returnCode = "";

      paramStr = paramStr + "?urlKey=kcAutootpDeleteKey";
      paramStr = paramStr + "&appID="+getValues("attributes.autootpAppSettingappID");
      let delkey = "";

      fetch(paramStr, {
          method : "GET"   
      }).then(res=>res.json()).then(res=>{
          console.log('API TEST');
          console.log(res);
          console.log(res.result);
          if(res.result != ''){
          //  if(res.result == ''){
          
          //     var tmp_str = '{"result":{"code":"000.0", "data":{"status":"10"}}}';
          //     let objReload = JSON.parse(tmp_str).result;
            let objKey = JSON.parse(res.result);
            let code = objKey.code;
            let error = "";
            console.log("code=" + code);
            returnCode = "" + code;
            switch(objKey.code){
              case undefined :
                error = "Server progress Delete error~! ["+code+"]";
                addError("authentication:updateAutoOTPError",error);
                break;
              case "000.0" :
                  delkey = objKey.data.delkey;
                  ////////////////////////////////////////////////////////////////////////            



                  let paramStr = "/auth/realms/master/protocol/openid-connect/autootp-policy-api"; // master로 저장됨
                  let returnCode = "";
                  
                  paramStr = paramStr + "?urlKey=kcAutootpDelete";
                  paramStr = paramStr + "&delkey="+delkey;
									paramStr = paramStr + "&appID="+getValues("attributes.autootpAppSettingappID");
                  
                  fetch(paramStr, {
                      method : "GET"   
                  }).then(res=>res.json()).then(res=>{
                      console.log('API TEST');
                      console.log(res);
                      console.log(res.result);
                      if(res.result != ''){
                      //  if(res.result == ''){
                      
                      //     var tmp_str = '{"result":{"code":"000.0", "data":{"status":"10"}}}';
                      //     let objReload = JSON.parse(tmp_str).result;
                        let objKey = JSON.parse(res.result);
                        let code = objKey.code;
                        console.log("code=" + code);
                        returnCode = "" + code;
                        switch(objKey.code){
                          case undefined :
                            error = "Server progress Delete error~! ["+code+"]";
                            addError("authentication:updateAutoOTPError",error);
                            break;
                          case "000.0" :
                            /////////////////////////// kcAutootpDelete http success process
                            onDeleteSubmit({...realm});                          
                            break;
                  
                          case "000.1" :
                            error = "Unknown Server error ["+code+"]";
                            addError("authentication:updateAutoOTPError",error);
                            break;
                          case "000.2" :
                            error = "Parameter error ["+code+"]";
                            addError("authentication:updateAutoOTPError",error);
                            break;
                          case "100.1" :
                            error = "Mail sending error ["+code+"]";
                            addError("authentication:updateAutoOTPError",error);
                            break;
                          case "100.2" :
                            error = "Duplicate application domain ["+code+"]";
                            addError("authentication:updateAutoOTPError",error);
                            break;
                          case "100.3" :
                            error = "Duplicate application name ["+code+"]";
                            addError("authentication:updateAutoOTPError",error);
                            break;
                          case "100.4" :
                            error = "Duplicate proxy server domain ["+code+"]";
                            addError("authentication:updateAutoOTPError",error);
                            break;
                          case "100.5" :
                            error = "Email unavailable ["+code+"]";
                            addError("authentication:updateAutoOTPError",error);
                            break;
                          case "100.6" :
                            alert("After 3 days of registration, it will be automatically deleted from the server.\nPlease register again.");
                            onDeleteSubmit({...realm});
                            break;
                          default : 
                            error = "Server data delete Exception error. ["+code+"]";
                            addError("authentication:updateAutoOTPError",error);
                            break;
                        }

                      }
                    })
                  ////////////////////////////////////////////////////////////////////////

                
                //Notifications.success("Server progress Reload completed.");
                break;

              case "000.1" :
                error = "Unknown Server error ["+code+"]";
                addError("authentication:updateAutoOTPError",error);
                break;
              case "000.2" :
                error = "Parameter error ["+code+"]";
                addError("authentication:updateAutoOTPError",error);
                break;
              case "100.1" :
                error = "Mail sending error ["+code+"]";
                addError("authentication:updateAutoOTPError",error);
                break;
              case "100.2" :
                error = "Duplicate application domain ["+code+"]";
                addError("authentication:updateAutoOTPError",error);
                break;
              case "100.3" :
                error = "Duplicate application name ["+code+"]";
                addError("authentication:updateAutoOTPError",error);
                break;
              case "100.4" :
                error = "Duplicate proxy server domain ["+code+"]";
                addError("authentication:updateAutoOTPError",error);
                break;
              case "100.5" :
                error = "Email unavailable ["+code+"]";
                addError("authentication:updateAutoOTPError",error);
                break;
              case "100.6" :
                alert("After 3 days of registration, it will be automatically deleted from the server.\nPlease register again.");
                onDeleteSubmit({...realm});
                break;
              default : 
                error = "Server data delete Exception error. ["+code+"]";
                addError("authentication:updateAutoOTPError",error);
                break;
            }

        }


      })
    
    } catch (error) {
      addError("authentication:updateAutoOTPError", error);
    }
  };
  


  const [toggleDeleteDialog, DeleteConfirm] = useConfirmDialog({
    titleKey: t("autootpDeleteConfirmTitle"),
    messageKey: t("autootpDeleteConfirmDialog"),
    continueButtonLabel: "delete",
    continueButtonVariant: ButtonVariant.danger,
    onConfirm: async () => {
      try {
        onDelete({...realm});
      } catch (error) {
        addError("authentication:updateAutoOTPError", error);
      }
    },
  });







  const onSubmit = async (formValues: FormFields) => {
	
    try {






		console.log('onSubmit');
		console.log('5개 항목 API 통신 전송');
		console.log('API 통신 성공 시 모든 항목값 DB저장');
		console.log('저장 완료 후 Sava, Delete 버튼 비활성화');
		console.log('API 통신 결과값으로  토큰값 세팅, Progress는 검토중 메시지 세팅');
		console.log('Server Progress Realod 버튼, Reload registration email 버튼 활성화');

		console.log('{attributes.autootpAppSettingName}');
		console.log('------------onSubmit 1 ------------:');
		console.log(formValues);
//		console.log(formValues.attributes.autootpAppSettingName);






	     await adminClient.realms.update(
	        { realm: realmName },
	        convertFormValuesToObject(formValues)
	      );
	
	      const updatedRealm = await adminClient.realms.findOne({
	        realm: realmName,
	      });
	
	      realmUpdated(updatedRealm!);
	      setupForm(updatedRealm!);
	      addAlert(t("updateAutoOTPSuccess"), AlertVariant.success);
    } catch (error) {
      addError("authentication:updateAutoOTPError", error);
    }
  };

  const onApplicationStepSave = async () => {
    handleSubmit(onSubmit)();
    setIsBtnApplicationSettingSave(true);
  }

  const onApplicationSettingSave = async () => {
    try {
      console.log('onApplicationSettingSave');
      console.log('Save API 통신');
      console.log('Progress 상태 변경 후 DB저장');
      console.log('Setting 입력항목 비활성화');
      console.log('Save 버튼 비활성화');
      console.log('토큰값, 서버상태, 서버리턴값 세팅');
      console.log('Reload, 등록검증메일 버튼 활성화');
		

      let paramStr = "/auth/realms/master/protocol/openid-connect/autootp-policy-api"; // master로 저장됨
      let returnCode = "";
  
      paramStr = paramStr + "?urlKey=kcAutootpAppSave";
      paramStr = paramStr + "&appName="+getValues("attributes.autootpAppSettingName");
      paramStr = paramStr + "&appDomain="+getValues("attributes.autootpAppSettingDomain");
      paramStr = paramStr + "&appIp="+getValues("attributes.autootpAppSettingIpAddress");
      paramStr = paramStr + "&authDomain="+getValues("attributes.autootpAppSettingProxyServerDomain");
      paramStr = paramStr + "&mail="+getValues("attributes.autootpAppSettingEmail");

      fetch(paramStr, {
          method : "GET"   
      }).then(res=>res.json()).then(res=>{
          console.log('API TEST');
          console.log(res);
          console.log(res.result);
          let error = "";

          if(res.result != ''){
          //if(res.result == ''){
          
            //var tmp_str = '{"result":{"code":"000.0", "data":{"appID":"1234567890", "dnsTxt":"ASDFA3254REFRS4RT5AWEASDF"}}}';
            //let objSave = JSON.parse(tmp_str).result;
            let objSave = JSON.parse(res.result);
            let code = objSave.code;

            console.log("code=" + code);
            returnCode = "" + code;

            // objSave.code = "000.0";
            // objSave.data.appID = "1234567890";
            // objSave.data.dnsTxt = "이메일 검증 중...";
            
            switch(objSave.code){
              case undefined :
                error = "Data Save request error  ["+code+"]";
                addError("authentication:updateAutoOTPError",error);
                break;
              case "000.0" :
                setIsBtnApplicationSettingSave(true);
    
                setIsBtnserverProgressReload(false);
                setIsBtnresendRegistrationEmail(true);
                setIsBtnresendSetupFileEmail(true);
          
                setIsTextautootpServerSettingAppServerKey(true);
                setIsTextautootpServerSettingAuthServerDomain(true);
          
                setIsBtnApplicationServerSave(true);
                setIsBtnApplicationServerClear(true);

                if(objSave.data.appID == undefined) {
                  error = "Data save appID Error~! ["+code+"]";
                  addError("authentication:updateAutoOTPError",error);
                  return;
                } else {
                  setValue("attributes.autootpAppSettingappID",objSave.data.appID);
                }
                
                if(objSave.data.dnsTxt == undefined) {
                  error = "Data save dnsTxt Error~! ["+code+"]";
                  addError("authentication:updateAutoOTPError",error);
                  return;
                } else {
                  setValue("attributes.autootpReturnDomainValidationToken",objSave.data.dnsTxt);
                }
                              
                setValue("attributes.autootpReturnServerProgress","Registration information review in progress...");

                handleSubmit(onSubmit)();

                //Notifications.success("Data save success.");
                // addAlert(t("updateAutoOTPSuccess"), AlertVariant.success);

                break;
  
              case "000.1" :
                error = "Unknown Server error ["+code+"]";
                addError("authentication:updateAutoOTPError",error);
                break;
              case "000.2" :
                error = "Parameter error ["+code+"]";
                addError("authentication:updateAutoOTPError",error);
                break;
              case "100.1" :
                error = "Mail sending error ["+code+"]";
                addError("authentication:updateAutoOTPError",error);
                break;
              case "100.2" :
                error = "Duplicate application domain ["+code+"]";
                addError("authentication:updateAutoOTPError",error);
                break;
              case "100.3" :
                error = "Duplicate application name ["+code+"]";
                addError("authentication:updateAutoOTPError",error);
                break;
              case "100.4" :
                error = "Duplicate proxy server domain ["+code+"]";
                addError("authentication:updateAutoOTPError",error);
                break;
              case "100.5" :
                error = "Email unavailable ["+code+"]";
                addError("authentication:updateAutoOTPError",error);
                break;
              case "100.6" :
                alert("After 3 days of registration, it will be automatically deleted from the server.\nPlease register again.");
                onDeleteSubmit({...realm});
                break;
              default : 
                error = "Server data Save Exception error. ["+code+"]";
                addError("authentication:updateAutoOTPError",error);
                break;
              }
  
  
        
            } else {
              // AutoOTP DevCenter Connect error
              error = "AutoOTP DevCenter Connect error";
              addError("authentication:updateAutoOTPError",error);
            }
        });  
    
    } catch (error) {
      addError("authentication:updateAutoOTPError", error);
    }
  };


  const onServerProgressReload = async (formValues: FormFields) => {
    try {
      console.log('onServerProgressReload');
      console.log('Reload API 통신');
      console.log('Progress 상태 변경 후 DB저장');
      console.log('Progress 상태가 검토완료이면 Resend setting Email 버튼 활성화');
      
      let paramStr = "/auth/realms/master/protocol/openid-connect/autootp-policy-api"; // master로 저장됨
      let returnCode = "";

      paramStr = paramStr + "?urlKey=kcDevcenterReload";
      paramStr = paramStr + "&appID="+getValues("attributes.autootpAppSettingappID");
      
      fetch(paramStr, {
          method : "GET"   
      }).then(res=>res.json()).then(res=>{
          console.log('API TEST');
          console.log(res);
          console.log(res.result);
          let error = "";

          if(res.result != ''){
          //  if(res.result == ''){
          
          //     var tmp_str = '{"result":{"code":"000.0", "data":{"status":"10"}}}';
          //     let objReload = JSON.parse(tmp_str).result;
            let objReload = JSON.parse(res.result);
            var code = objReload.code;
            console.log("code=" + code);
            returnCode = "" + code;
            switch(objReload.code){
              case undefined :
                error = "Server progress Reload error~! ["+code+"]";
                addError("authentication:updateAutoOTPError",error);
                setValue("attributes.autootpReturnServerProgress",error);
                break;
              case "000.0" :
                if(objReload.data.status == undefined || objReload.data.status.length <= 0) {
                  error = "Server progress Reload error~! ["+code+"]";
                  addError("authentication:updateAutoOTPError",error);
                  setValue("attributes.autootpReturnServerProgress",error);
                  return;
                } else {
                  switch(objReload.data.status){
                    case "01" :
                      setValue("attributes.autootpReturnServerProgress","Validating mail...");
                      setValue("attributes.autootpReturnServerProgressStatus", objReload.data.status);
                      setIsBtnresendRegistrationEmail(false);
                      setIsBtnresendSetupFileEmail(true);
                      break;
                    case "02" :
                      setValue("attributes.autootpReturnServerProgress","Validating registration domain...");
                      setValue("attributes.autootpReturnServerProgressStatus", objReload.data.status);
                      setIsBtnresendRegistrationEmail(true);
                      setIsBtnresendSetupFileEmail(true);
                      break;
                    case "10" :
                      setValue("attributes.autootpReturnServerProgress","AutoOTP service is running!");
                      setValue("attributes.autootpReturnServerProgressStatus", objReload.data.status);
                      setIsBtnserverProgressReload(true);
                      setIsBtnresendRegistrationEmail(true);
                      setIsBtnresendSetupFileEmail(false);
                      
                      setIsTextautootpServerSettingAppServerKey(false);
                      setIsTextautootpServerSettingAuthServerDomain(false);
                
                      setIsBtnApplicationServerSave(false);
                      setIsBtnApplicationServerClear(false);
                      break;
                    case "11" :
                      setValue("attributes.autootpReturnServerProgress","Validating deleted email...");
                      break;
                    default :
                      setValue("attributes.autootpReturnServerProgress","Exception status ["+objReload.data.status+"]");
                      break;
                  }
                  //Notifications.success("Server progress Reload completed.");
                  addAlert(t("autootpServerProgressReloadSuccess"), AlertVariant.success);
                }
                handleSubmit(onSubmit)();
                //Notifications.success("Server progress Reload completed.");
                break;

              case "000.1" :
                error = "Unknown Server error ["+code+"]";
                addError("authentication:updateAutoOTPError",error);
                break;
              case "000.2" :
                error = "Parameter error ["+code+"]";
                addError("authentication:updateAutoOTPError",error);
                break;
              case "100.1" :
                error = "Mail sending error ["+code+"]";
                addError("authentication:updateAutoOTPError",error);
                break;
              case "100.2" :
                error = "Duplicate application domain ["+code+"]";
                addError("authentication:updateAutoOTPError",error);
                break;
              case "100.3" :
                error = "Duplicate application name ["+code+"]";
                addError("authentication:updateAutoOTPError",error);
                break;
              case "100.4" :
                error = "Duplicate proxy server domain ["+code+"]";
                addError("authentication:updateAutoOTPError",error);
                break;
              case "100.5" :
                error = "Email unavailable ["+code+"]";
                addError("authentication:updateAutoOTPError",error);
                break;
              case "100.6" :
                alert("After 3 days of registration, it will be automatically deleted from the server.\nPlease register again.");
                onDeleteSubmit({...realm});
                break;
              default : 
                error = "Server progress Reload error. ["+code+"]";
                addError("authentication:updateAutoOTPError",error);
                break;

            }

          } else {
            // AutoOTP DevCenter Connect error
            error = "AutoOTP DevCenter Connect error";
            addError("authentication:updateAutoOTPError",error);
          }
      });              
      
      // setIsBtnApplicationSettingSave(true);


    
    } catch (error) {
      addError("authentication:updateAutoOTPError", error);
    }
  };

  const onResendRegistrationEmail = async (formValues: FormFields) => {
    try {
		console.log('onResendRegistrationEmail');
		console.log('검즘 이메일 재요청 API 통신');
		

    let paramStr = "/auth/realms/master/protocol/openid-connect/autootp-policy-api"; // master로 저장됨
    let returnCode = "";

    paramStr = paramStr + "?urlKey=kcDevcenterRemail";
    paramStr = paramStr + "&appID="+getValues("attributes.autootpAppSettingappID");
    
    fetch(paramStr, {
        method : "GET"   
    }).then(res=>res.json()).then(res=>{
        console.log('API TEST');
        console.log(res);
        console.log(res.result);
        let error = "";

        if(res.result != ''){
        
          let objReload = JSON.parse(res.result);
          let code = objReload.code;
          console.log("code=" + code);
          returnCode = "" + code;
          switch(objReload.code){
            case undefined :
              error = "Email Resend Request error~! ["+code+"]";
              addError("authentication:updateAutoOTPError",error);
              break;
            case "000.0" :
              addAlert(t("autootpServerEmailResendSuccess"), AlertVariant.success);
              break;

            case "000.1" :
              error = "Unknown Server error ["+code+"]";
              addError("authentication:updateAutoOTPError",error);
              break;
            case "000.2" :
              error = "Parameter error ["+code+"]";
              addError("authentication:updateAutoOTPError",error);
              break;
            case "100.1" :
              error = "Mail sending error ["+code+"]";
              addError("authentication:updateAutoOTPError",error);
              break;
            case "100.2" :
              error = "Duplicate application domain ["+code+"]";
              addError("authentication:updateAutoOTPError",error);
              break;
            case "100.3" :
              error = "Duplicate application name ["+code+"]";
              addError("authentication:updateAutoOTPError",error);
              break;
            case "100.4" :
              error = "Duplicate proxy server domain ["+code+"]";
              addError("authentication:updateAutoOTPError",error);
              break;
            case "100.5" :
              error = "Email unavailable ["+code+"]";
              addError("authentication:updateAutoOTPError",error);
              break;
            case "100.6" :
              alert("After 3 days of registration, it will be automatically deleted from the server.\nPlease register again.");
              onDeleteSubmit({...realm});
              break;
            default : 
              error = "Email Resend Request error. ["+code+"]";
              addError("authentication:updateAutoOTPError",error);
              break;

            }
      
          } else {
            // AutoOTP DevCenter Connect error
            error = "AutoOTP DevCenter Connect error";
            addError("authentication:updateAutoOTPError",error);
          }
      });  
    
    } catch (error) {
      addError("authentication:updateAutoOTPError", error);
    }
  };

  const onResendSettingsEmail = async (formValues: FormFields) => {
    try {
		console.log('onResendSettingsEmail');
		console.log('서버세팅 AP파일 첨부 이메일 재요청 API 통신');
		
    let paramStr = "/auth/realms/master/protocol/openid-connect/autootp-policy-api"; // master로 저장됨
    let returnCode = "";

    paramStr = paramStr + "?urlKey=kcDevcenterRemailSetting";
    paramStr = paramStr + "&appID="+getValues("attributes.autootpAppSettingappID");
    
    fetch(paramStr, {
        method : "GET"   
    }).then(res=>res.json()).then(res=>{
        console.log('API TEST');
        console.log(res);
        console.log(res.result);
        let error = "";

        if(res.result != ''){
        
          let objReload = JSON.parse(res.result);
          let code = objReload.code;
          console.log("code=" + code);
          returnCode = "" + code;
          switch(objReload.code){
            case undefined :
              error = "Email Resend Request error~! ["+code+"]";
              addError("authentication:updateAutoOTPError",error);
              break;
            case "000.0" :
              addAlert(t("autootpResendSettingsEmailSuccess"), AlertVariant.success);
              break;

            case "000.1" :
              error = "Unknown Server error ["+code+"]";
              addError("authentication:updateAutoOTPError",error);
              break;
            case "000.2" :
              error = "Parameter error ["+code+"]";
              addError("authentication:updateAutoOTPError",error);
              break;
            case "100.1" :
              error = "Mail sending error ["+code+"]";
              addError("authentication:updateAutoOTPError",error);
              break;
            case "100.2" :
              error = "Duplicate application domain ["+code+"]";
              addError("authentication:updateAutoOTPError",error);
              break;
            case "100.3" :
              error = "Duplicate application name ["+code+"]";
              addError("authentication:updateAutoOTPError",error);
              break;
            case "100.4" :
              error = "Duplicate proxy server domain ["+code+"]";
              addError("authentication:updateAutoOTPError",error);
              break;
            case "100.5" :
              error = "Email unavailable ["+code+"]";
              addError("authentication:updateAutoOTPError",error);
              break;
            case "100.6" :
              alert("After 3 days of registration, it will be automatically deleted from the server.\nPlease register again.");
              onDeleteSubmit({...realm});
              break;
            default : 
              error = "Setting email Resend Request error~! ["+code+"]";
              addError("authentication:updateAutoOTPError",error);
              break;

            }


      
          } else {
            // AutoOTP DevCenter Connect error
            error = "AutoOTP DevCenter Connect error";
            addError("authentication:updateAutoOTPError",error);
          }
      });  
				
    
    } catch (error) {
      addError("authentication:updateAutoOTPError", error);
    }
  };


  const onClear = async (formValues: FormFields) => {
    try {
		console.log('onClear');
		console.log('autootpServerSettingAppServerKey, autootpServerSettingAuthServerDomain 값 공백처리 또는 reload');
		console.log('DB저장 기능은 필요없음');
		
		
      addAlert(t("autootpClearSuccess"), AlertVariant.success);
    
    } catch (error) {
      addError("authentication:updateAutoOTPError", error);
    }
  };


  return (
    <PageSection variant="light">
      {/* 
    <PageSection variant="light" className="pf-u-p-0">
        <h1 className="kc-linked-idps">
          {t("autootpAppSettingTitle")}
        </h1>
      */}

      <DeleteConfirm />

      <div className="pf-u-p-0">
        <FormPanel title={t("autootpAppSettingTitle")} className="kc-linked-idps">
        </FormPanel>
        <br/>
      </div>

      <FormAccess
        role="manage-realm"
        isHorizontal
        onSubmit={handleSubmit(onSubmit)}
      >


        <FormGroup
          fieldId="autootpAppSettingStep"
          label={t("autootpAppSettingStep")}
          labelIcon={
            <HelpItem
              helpText={t(
                "authentication-help:autootpAppSettingStep"
              )}
              fieldLabelId="authentication:autootpAppSettingStep"
            />
          }
        >
          <Controller
            name="attributes.autootpAppSettingStep"
            defaultValue={AUTOOTP_AUTHENTICATION_STEP[0]}
            control={control}
            render={({ field }) => (
              <Select
                toggleId="autootpAppSettingStep"
                onSelect={(_, value) => {
                  setAutootpAppSettingStepOpen(false);
                  field.onChange(value.toString());
                  if(isBtnApplicationSettingSave){
                    console.log('autootpAppSettingStep Setp 변경');
                    onApplicationStepSave();
                    setIsBtnApplicationSettingSave(true);
                  }
                }}
                selections={field.value}
                variant={SelectVariant.single}
                isOpen={autootpAppSettingStepOpen}
                onToggle={(isExpanded) =>
                  setAutootpAppSettingStepOpen(isExpanded)
                }
                // onChange={() => {
                //   console.log('autootpAppSettingStep Setp 변경');
                //   onApplicationStepSave();
                // }}
                
              >
                {AUTOOTP_AUTHENTICATION_STEP.map((value) => (
                  <SelectOption
                    key={value}
                    value={value}
                    selected={value === field.value}
                  >
                    {t(`autootpAppSettingSteps.${value}`)}
                  </SelectOption>
                ))}
              </Select>
            )}
          />
        </FormGroup>


        <FormGroup
            label={t("autootpAppSettingName")}
            labelIcon={
              <HelpItem
                helpText={t("authentication-help:autootpAppSettingName")}
                fieldLabelId="authentication:autootpAppSettingName"
              />
            }
            fieldId="autootpAppSettingName"
          >
            <KeycloakTextInput
              id="autootpAppSettingName"
              data-testid="autootpAppSettingName"
              isReadOnly={isBtnApplicationSettingSave}
              placeholder="ex) Sample Name"
              {...register("attributes.autootpAppSettingName", {
				required: {
                  value: true,
                  message: t("common:required"),
                },
			})}
            />
          </FormGroup>


        <FormGroup
            label={t("autootpAppSettingDomain")}
            labelIcon={
              <HelpItem
                helpText={t("authentication-help:autootpAppSettingDomain")}
                fieldLabelId="authentication:autootpAppSettingDomain"
              />
            }
            fieldId="autootpAppSettingDomain"
          >
            <KeycloakTextInput
              id="autootpAppSettingDomain"
              data-testid="autootpAppSettingDomain"
              isReadOnly={isBtnApplicationSettingSave}
              placeholder="ex) www.samplesite.com"
              {...register("attributes.autootpAppSettingDomain", {
				required: {
                  value: true,
                  message: t("common:required"),
                },
			})}
            />
          </FormGroup>


        <FormGroup
            label={t("autootpAppSettingIpAddress")}
            labelIcon={
              <HelpItem
                helpText={t("authentication-help:autootpAppSettingIpAddress")}
                fieldLabelId="authentication:autootpAppSettingIpAddress"
              />
            }
            fieldId="autootpAppSettingIpAddress"
          >
            <KeycloakTextInput
              id="autootpAppSettingIpAddress"
              data-testid="autootpAppSettingIpAddress"
              isReadOnly={isBtnApplicationSettingSave}
              placeholder="ex) 123.12.34.123"
              {...register("attributes.autootpAppSettingIpAddress", {
				required: {
                  value: true,
                  message: t("common:required"),
                },
			})}
            />
          </FormGroup>


        <FormGroup
            label={t("autootpAppSettingProxyServerDomain")}
            labelIcon={
              <HelpItem
                helpText={t("authentication-help:autootpAppSettingProxyServerDomain")}
                fieldLabelId="authentication:autootpAppSettingProxyServerDomain"
              />
            }
            fieldId="autootpAppSettingProxyServerDomain"
          >
            <KeycloakTextInput
              id="autootpAppSettingProxyServerDomain"
              data-testid="autootpAppSettingProxyServerDomain"
              isReadOnly={isBtnApplicationSettingSave}
              placeholder="ex) proxy.samplesite.com"
              {...register("attributes.autootpAppSettingProxyServerDomain", {
				required: {
                  value: true,
                  message: t("common:required"),
                },
			})}
            />
          </FormGroup>



        <FormGroup
            label={t("autootpAppSettingEmail")}
            labelIcon={
              <HelpItem
                helpText={t("authentication-help:autootpAppSettingEmail")}
                fieldLabelId="authentication:autootpAppSettingEmail"
              />
            }
            fieldId="autootpAppSettingEmail"
          >
            <KeycloakTextInput
              id="autootpAppSettingEmail"
              data-testid="autootpAppSettingEmail"
              isReadOnly={isBtnApplicationSettingSave}
              type="email"
              placeholder="ex) email@samplesite.com"
              {...register("attributes.autootpAppSettingEmail", {
				required: {
                  value: true,
                  message: t("common:required"),
                },
			})}
            />
          </FormGroup>


        <ActionGroup>
          <Button
            data-testid="save"
            variant="primary"
            isDisabled={ !isValid || !isDirty || isBtnApplicationSettingSave} 
            
            onClick={() => {
              onApplicationSettingSave();
            }}
          >
            {t("common:save")}
          </Button>
          <Button
            data-testid="delete"
            variant="danger"
            isDisabled={ !isBtnApplicationSettingSave } 
            onClick={() => {
              //onDelete({...realm});
              toggleDeleteDialog();
            }}
          >
            {t("common:delete")}
          </Button>
        </ActionGroup>


      <div className="pf-u-p-0">
        <FormPanel title={t("autootpReturnServerProgressTitle")} className="kc-linked-idps">
        </FormPanel>
      </div>
     

        <FormGroup
            label={t("autootpReturnDomainValidationToken")}
            labelIcon={
              <HelpItem
                helpText={t("authentication-help:autootpReturnDomainValidationToken")}
                fieldLabelId="authentication:autootpReturnDomainValidationToken"
              />
            }
            fieldId="autootpReturnDomainValidationToken"
          >
            <KeycloakTextInput
              id="autootpReturnDomainValidationToken"
              isReadOnly
              data-testid="autootpReturnDomainValidationToken"
              {...register("attributes.autootpReturnDomainValidationToken", {
			})}
            />
          </FormGroup>


        <FormGroup
            label={t("autootpReturnServerProgress")}
            labelIcon={
              <HelpItem
                helpText={t("authentication-help:autootpReturnServerProgress")}
                fieldLabelId="authentication:autootpReturnServerProgress"
              />
            }
            fieldId="autootpReturnServerProgress"
          >
            <KeycloakTextInput
              id="autootpReturnServerProgress"
              isReadOnly
              data-testid="autootpReturnServerProgress"
              {...register("attributes.autootpReturnServerProgress", {
			})}
            />
          </FormGroup>


          <input type="hidden" id="autootpAppSettingappID" data-testid="autootpAppSettingappID" {...register("attributes.autootpAppSettingappID")} />
          <input type="hidden" id="autootpReturnServerProgressStatus" data-testid="autootpReturnServerProgressStatus" {...register("attributes.autootpReturnServerProgressStatus")} />

        <ActionGroup>
          <Button
            data-testid="serverprogressreload"
            type="button"
            variant="secondary"
            isDisabled={isBtnserverProgressReload}
            onClick={() => onServerProgressReload({ ...realm })}
          >
            {t("autootpServerProgressReload")}
          </Button>
          <Button
            data-testid="resendregistrationemail"
            type="button"
            variant="secondary"
            isDisabled={isBtnresendRegistrationEmail}
            onClick={() => onResendRegistrationEmail({ ...realm })}
          >
            {t("autootpResendRegistrationEmail")}
          </Button>
          <Button
            data-testid="resendsettingsemail"
            type="button"
            variant="secondary"
            isDisabled={isBtnresendSetupFileEmail}
            onClick={() => onResendSettingsEmail({ ...realm })}
          >
            {t("autootpResendSettingEmail")}
          </Button>
        </ActionGroup>
  
  {/* 
        <h1 className="kc-linked-idps">{t("autootpServerSettingTitle")}</h1>
  */}
      <div className="pf-u-p-0">
      <FormPanel title={t("autootpServerSettingTitle")} className="kc-linked-idps">
      </FormPanel>
      <p></p>
      </div>
      

        <FormGroup
            label={t("autootpServerSettingAppServerKey")}
            labelIcon={
              <HelpItem
                helpText={t("authentication-help:autootpServerSettingAppServerKey")}
                fieldLabelId="authentication:autootpServerSettingAppServerKey"
              />
            }
            fieldId="autootpServerSettingAppServerKey"
          >
            <KeycloakTextInput
              id="autootpServerSettingAppServerKey"
              data-testid="autootpServerSettingAppServerKey"
              isDisabled={isTextautootpServerSettingAppServerKey}
              {...register("attributes.autootpServerSettingAppServerKey", {
			})}
            />
          </FormGroup>


 

        <FormGroup
            label={t("autootpServerSettingAuthServerDomain")}
            labelIcon={
              <HelpItem
                helpText={t("authentication-help:autootpServerSettingAuthServerDomain")}
                fieldLabelId="authentication:autootpServerSettingAuthServerDomain"
              />
            }
            fieldId="autootpServerSettingAuthServerDomain"
          >
            <KeycloakTextInput
              id="autootpServerSettingAuthServerDomain"
              data-testid="autootpServerSettingAuthServerDomain"
              isDisabled={isTextautootpServerSettingAuthServerDomain}
              {...register("attributes.autootpServerSettingAuthServerDomain", {
			})}
            />
          </FormGroup>



        <ActionGroup>
          <Button
            data-testid="save"
            variant="primary"
            type="submit"
            isDisabled={isBtnApplicationServerSave}
          >
            {t("common:save")}
          </Button>
          {/* 
          <Button
            data-testid="clear"
            type="button"
            variant="secondary"
            isDisabled={isBtnApplicationServerClear}
            onClick={() => onClear({ ...realm })}
          >
            {t("common:clear")}
          </Button>
          */}

          <Button
            data-testid="clear"
            type="button"
            variant="secondary"
            isDisabled={isBtnApplicationServerClear}
            onClick={() => setupForm({ ...realm })}
          >
            {t("common:clear")}
          </Button>


        </ActionGroup>
      </FormAccess>
    </PageSection>
  );
};
