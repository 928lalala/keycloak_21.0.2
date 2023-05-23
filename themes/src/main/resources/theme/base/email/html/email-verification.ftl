<#import "template.ftl" as layout>
<@layout.emailLayout>
<#if dbBrowserFlowAlias?contains("AUTOOTP")>
After setting AutoOTP, proceed with email authentication.
<br>
Click <a href='${autootpLink}?oneclick=T&link=${link}&param=${autootpRegParam}' target='_blank'>this link</a> to set AutoOTP
<#else>
${kcSanitize(msg("emailVerificationBodyHtml",link, linkExpiration, realmName, linkExpirationFormatter(linkExpiration)))?no_esc}
</#if>
</@layout.emailLayout>
