// *********************************************************** 
// ErgoQual execution
// Fichier contenant toutes les fonctions nécessaire au fonctionnement des règles ErgoQualRules.js
// + Tableau contenant l'appel de toutes les fonctions qui sont des règles
// *********************************************************** 

function Esd1AddOn(bInternet, bIntranet, bShowReport, bShowLog, iErrorLevel, asIgnoredRules, bForce, maqEdgeMode) {
    // on mémorise le fait que l'on est en mode ADD-ON
    gbEsd1AddOn = true;
    
    // on peut forcer les erreurs en dehors du bloc appli avec force=oui
    if (window.location.href.indexOf("force=") > 0) {
        gbEsd1Force = true;
    } else {
        gbEsd1Force = bForce;
    }
    Esd1ErgoQual(bInternet, bIntranet, bShowReport, bShowLog, iErrorLevel, asIgnoredRules, ESD1_MESSAGES.Tools.AllTools, maqEdgeMode);
}

function Esd1ErgoQual(bInternet, bIntranet, bShowReport, bShowLog, iErrorLevel, asIgnoredRules, iDisplayedTools, maqEdgeMode) {
    // Passage des paramètres en variables globales
    gbEsd1Internet = bInternet;
    gbEsd1Intranet = bIntranet;
    gbEsd1ShowReport = bShowReport;
    gbEsd1ShowLog = bShowLog;
    giEsd1ErrorLevel = iErrorLevel;
    gbMaqEdge = maqEdgeMode;
    // L'appel est réalisé depuis le MAQ si on est ni en mode ADD-ON ni en Testqual
    gbEsd1Maq = gbMaqEdge || (!gbEsd1AddOn && !gbEsd1TestQual); // TODO: A supprimer une fois le Maq Edge comment a être different de Maq standard

    // si lancement via MAQ, on reste en mode appli uniquement pour éviter les remontées d'erreur sur les gabarits.
    if (gbEsd1Maq) {
        gbEsd1Force = false;
    }

    if (asIgnoredRules == null || asIgnoredRules == undefined)
        gaEsd1sIgnoredRules = [];
    else if (asIgnoredRules.push) // Test si .push est disponible c'est un tableau, donc on le recopie dans gaEsd1sIgnoredRules
        gaEsd1sIgnoredRules = asIgnoredRules;
    else if (asIgnoredRules.toUpperCase && asIgnoredRules.length > 0) // Si c'est juste une chaine de caractère (.toUpperCase disponible), on la charge dans le tableau
        gaEsd1sIgnoredRules = [asIgnoredRules];
    else
        gaEsd1sIgnoredRules = [];

    if (iDisplayedTools == null || iDisplayedTools == undefined)
        giEsd1sDisplayedTools = ESD1_MESSAGES.Tools.NoTools;
    else
        giEsd1sDisplayedTools = iDisplayedTools;

    // activation de la trace si en QS on a trace= (peu importe la valeur :-) )
    if (!bShowLog) { gbEsd1ShowLog = (window.location.href.indexOf("trace=") > 0); }

    // Preparation
    // Si le script  ErgoQual a déjà été lancé sur la page HTML , on affiche juste un message demandant de recharger la page
    // todo fbc : éventuellement faire un flip/flop : j'active le dia/j'efface le diag
    if (!Esd1ErgoqualPrepare()) {
        console.log("AlreadyChecked")
        noContentInterruptAudit = true;
        alert(ESD1_MESSAGES.Std.AlreadyChecked);
        return;
    }

    Trace($(this), "Paramètres d'entrée : mode Intranet =" + bIntranet + " mode Internet=" + bInternet + " lancement depuis AddON =" + gbEsd1AddOn + " Avec forçage sur la page entière =" + gbEsd1Force, "");

    // Tableaux contenant l'appel des fonctions d'ErgoQualRules.js
    const ruleFunctions = [
        Esd1Rule1, 
        Esd1Rule2,   
        Esd1Rule3,   
        //Esd1Rule4,   
        Esd1Rule5,   
        Esd1Rule6,   
        Esd1Rule7,   
        //Esd1Rule8,   
        //Esd1Rule9,   
        Esd1Rule10,   
        Esd1Rule11,  
        Esd1Rule12,  
        Esd1Rule13,  
        //Esd1Rule14,    
        Esd1Rule15,    
        Esd1Rule16,    
        Esd1Rule17,  
        Esd1Rule18,  
        Esd1Rule19,  
        Esd1Rule21,  
        Esd1Rule22,  
        Esd1Rule26,  
        Esd1Rule27,  
        Esd1Rule30,  
        Esd1Rule31,  
        Esd1Rule32,  
        Esd1Rule33,  
        Esd1Rule34,  
        Esd1Rule35,  
        Esd1Rule36,  
        Esd1Rule37,  
        Esd1Rule38,  
        Esd1Rule40,  
        Esd1Rule41,  
        // Esd1Rule42,  
        Esd1Rule43,  
        // Esd1Rule44,  
        Esd1Rule45,  
        Esd1Rule46,  
        Esd1Rule47,  
        Esd1Rule48,  
        Esd1Rule49,  
        Esd1Rule50,  
        Esd1Rule51, 
        Esd1Rule54,  
        Esd1Rule55,  
        Esd1Rule59,  
        Esd1Rule61,  
        Esd1Rule65,  
        Esd1Rule66,  
        Esd1Rule67,  
        Esd1Rule69,  
        Esd1Rule71,  
        Esd1Rule72,  
        Esd1Rule73,  
        Esd1Rule75,   
        Esd1Rule80,  
        Esd1Rule81,  
        Esd1Rule82,  
        Esd1Rule83,  
        Esd1Rule87,  
        Esd1Rule88,  
        Esd1Rule89,  
        Esd1Rule90,  
        Esd1Rule91,  
        Esd1Rule92,  
        Esd1Rule93,  
        Esd1Rule94,  
        Esd1Rule95,  
        Esd1Rule96,  
        Esd1Rule97,  
        Esd1Rule98,  
        Esd1Rule99   
    ];
    
    let missedRulesList = "";
    
    ruleFunctions.forEach((ruleFunction) => {
        try {
            ruleFunction();
        } catch (exception) {
            let ruleName =  ` R${ruleFunction.name.split('Esd1Rule')[1]}`
            missedRulesList += ruleName;
            console.log(`Exception remonté dans la règle ${ruleName}`, exception)
        }
    });
    
     // en cas d'erreur, affiche l'ensemble des règles incriminées
    if (gbEsd1AddOn && missedRulesList !== "") {
        alert(`Validation stopped: R${missedRulesList}`);
    }

    // Durée de traitement
    if (gbEsd1ShowLog) {
        // on affiche cette info uniquement en mode Trace=O
        $(".ergoqual_diverror").append("<p>" + ESD1_MESSAGES.Std.Duration.replace("{0}", ((new Date()).getTime() - dtEsd1StartTime.getTime())) + "</p>");
    }

    // Effacement du bloc Erreur si pas d'erreur ou si aucun message d'erreur n'est présent :il peut y avoir une erreur sans message d'erreur si une exception est levée dans une règle (évite la présence d'un cadre rouge vide).
    if (giEsd1ErrCounter == 0 || !$(".ergoqual_diverror").children().length) {

        $(".ergoqual_diverror").remove();

        if (gbEsd1Maq && !gbEsd1Force && !$("div.a_blocappli").length) {
            // Maq : on a pas trouvé d'erreur et il n'y a pas de bloc appli dans la page.
            alert(ESD1_MESSAGES.Std.NoBlocAppli);
        } else if (!gbEsd1Force && !$(gContentSelector).length
        ) {
            // extension : on a pas trouvé d'erreur et il n'y a pas de contenu trouvé dans la page.
            alert(ESD1_MESSAGES.Std.NoContent);
            noContentInterruptAudit = true;
        }
        else {
            // Cas de la validation dans le maquetteur sans erreur à remonter : Pas de message de bonne fin
            // Cas de la validation hors maquetteur sans erreur à remonter : Message de bonne fin
            // if (!window.external || !('Esd1ErgoQualNotification' in window.external))      alert(ESD1_MESSAGES.Std.ValidationOk);
            // FBC on n'affiche un compte rendu OK que sur l'appel depuis l'ADD ON
            if (gbEsd1AddOn && gbEsd1ShowReport && !gbEsd1ALLY) alert(ESD1_MESSAGES.Std.ValidationOk);
        }
    }

    // Barre de commandes :	Afficher les blocs cachés - Plier/déplier la liste des erreurs
    // on ne l'affiche que lorsque l'on est dans l'Add-on
    if (giEsd1sDisplayedTools != ESD1_MESSAGES.Tools.NoTools) {
        // compteur d'outils
        var iCptTools = 0;

        // La charte est-elle responsive (présence de ei_custom_responsive.css).
        // var estCharteResponsive = $("head link[href*='ei_custom_responsive.css']").length;
        var estCharteResponsive = $("head link[href*='ei_custom_responsive.css']").length == 0 ? false : true;

        //on récupère le chemin vers les css (on s'appuie sur v3base qui est sur toutes les chartes)
        var cssPath = null;
        try {
            cssPath = $("head link[href*='v3base.css']").attr('href').replace('v3base.css', '');
        } catch (e) { }
        if (cssPath == null) {
            try {
                cssPath = $("head link[href*='ei_base.css']").attr('href').replace('ei_base.css', '');
            } catch (e) { }
        }

        var agrCssResponsive = "";
        if ((!estCharteResponsive || !gbEsd1AddOn) && cssPath != null) { //TODO: MV3 update
            //il n'y a pas déjà de css responsive, on prévoit d'y ajouter sur les vues smartphone/tablet...
            agrCssResponsive += "$(myWindow).load(function(){";
            agrCssResponsive += "$(myWindow.document).find('head').append('<link rel=\\\'stylesheet\\\' type=\\\'text/css\\\' href=\\\'" + cssPath + "ei_custom_responsive.css\\\'/>');";
            agrCssResponsive += "});";
        }


    // ******** On click functions  ******** // 
        //TODO: conditionner cette fonction pour ne pas l'appeler dans le maquetteur
        function ergoqualExportCsv(event) {
            var errors = document.querySelectorAll('[data-ergoqual-counter]');
            var CSV = [
                'identifiant; criticité; règle; intitulé; code',
            ];
            errors.forEach(function(error) {
                CSV.push(error.getAttribute('data-ergoqual-counter') + ';' + error.getAttribute('data-ergoqual-level') + ';' + error.getAttribute('data-ergoqual-errorid') + ';' + error.getAttribute('data-ergoqual-text').replace(";", "") + ';' + decodeURIComponent(error.getAttribute('data-ergoqual-code')));
            });
            var sCSV = CSV.join('\n');
            const dateRapport = new Date();
            var fakeLink = document.createElement('a');
            let blob = new Blob(["\uFEFF" + sCSV], { type: "text/csv;charset=UTF-8" });
            let url = URL.createObjectURL(blob);
            fakeLink.href = url;
            fakeLink.download = `ergoqual_rapport_${dateRapport.toISOString().slice(0, 10)}_${dateRapport.toISOString().slice(11, 19)}.csv`;
            fakeLink.click();
            fakeLink.remove();
        }

        
        function handleSmartHViewClick(event) {
            event.stopPropagation();
            var myWindow = window.open(document.location.href, 'SmartHView', 'scrollbars=yes,toolbar=no,menubar=no,resizable=yes');
            myWindow.resizeTo(340, 710);
            myWindow.focus();
            // Add any additional CSS if needed
            myWindow.document.head.insertAdjacentHTML('beforeend', agrCssResponsive);
        }

        function handleSmartVViewClick(event) {
            event.stopPropagation();
            var myWindow = window.open(document.location.href, 'SmartVView', 'scrollbars=yes,toolbar=no,menubar=no,resizable=yes');
            myWindow.resizeTo(660, 390);
            myWindow.focus();
            // Add any additional CSS if needed
            myWindow.document.head.insertAdjacentHTML('beforeend', agrCssResponsive);
        }

        function openWindowWithSettings(name, width, height) {
            return function(event) {
                event.stopPropagation();
                var myWindow = window.open(document.location.href, name, 'scrollbars=yes,toolbar=no,menubar=no,resizable=yes');
                myWindow.resizeTo(width, height);
                myWindow.focus();
                // Add any additional CSS if needed
                myWindow.document.head.insertAdjacentHTML('beforeend', agrCssResponsive);
            };
        }

        function handleShowHidden(event) {
            event.stopPropagation();
            $(this).toggleClass('ei_ergoqual_showhidden_selected');
            if ($('.ei_ergoqual_show_element').length) {
                $('.ei_ergoqual_show_element').removeClass('ei_ergoqual_show_element');
            } else {
                $('body').find(':hidden').not('script, style, .ei_ergoqual_responsive, #ergoqual_diverror').addClass('ei_ergoqual_show_element');
            }
        }
    // ******** End of Onclick functions  ******** // 
        

    // ****** TOOLS SECTION ********//
        // New tool ! : Content translation :)     
        var isYtranslated = false;

        function translateBodyByErgoqualHeight() {
            var ergoqual = document.getElementById('ergoqual');
            var ergoqualHeight = ergoqual.offsetHeight;
            var bodyElement = document.body;
            var translateLink = document.getElementById('TranslateYContent');

            bodyElement.style.transition = 'transform 0.3s ease';
            ergoqual.style.transition = 'transform 0.3s ease';

            if (isYtranslated) {
                bodyElement.style.transform = 'translateY(0)';
                ergoqual.style.transform = 'translateY(0)';
                translateLink.className = 'ei_ergoqual_smartphone ei_icon_go_bottom adj_fsize'; 
            } else {
                bodyElement.style.transform = `translateY(${ergoqualHeight+20}px)`;
                ergoqual.style.transform = `translateY(-${ergoqualHeight+20}px)`;
                translateLink.className = 'ei_ergoqual_smartphone ei_icon_go_top adj_fsize';
            }

            isYtranslated = !isYtranslated;
        }
    
        var agrHtml = `<div id="test2" class="ergoqual_top_menu">`;
       
        // On affiche les compteurs d'erreurs uniquement si on affiche la liste des erreurs (sélection autre que Outils dans le menu du AddOn).
        if ($(".ergoqual_diverror").length > 0) {
            // On affiche le nombre d'erreurs, d'alertes, d'infos.
            agrHtml += '<ul class="ei_ergoqual_message_counter">';
            if (giEsd1ErrorMessageCounter > 0) { agrHtml += "<li><span title='" + giEsd1ErrorMessageCounter + " " + ESD1_MESSAGES.Bar.Errors + "' class='ei_ergoqual_error ei_ergoqual_gly_ic_clear' data-value='" + giEsd1ErrorMessageCounter + "'> " + giEsd1ErrorMessageCounter + " " + ESD1_MESSAGES.Bar.Errors + "</span></li>"; }
            if (giEsd1WarningMessageCounter > 0) { agrHtml += "<li><span title='" + giEsd1WarningMessageCounter + " " + ESD1_MESSAGES.Bar.Alerts + "' class='ei_ergoqual_warning ei_ergoqual_gly_ic_warning' data-value='" + giEsd1WarningMessageCounter + "'> " + giEsd1WarningMessageCounter + " " + ESD1_MESSAGES.Bar.Alerts + "</span></li>"; }
            if (giEsd1InfoMessageCounter > 0) { agrHtml += "<li><span title='" + giEsd1InfoMessageCounter + " " + ESD1_MESSAGES.Bar.Infos + "' class='ei_ergoqual_info ei_ergoqual_gly_ic_info' data-value='" + giEsd1InfoMessageCounter + "'> " + giEsd1InfoMessageCounter + " " + ESD1_MESSAGES.Bar.Infos + "</span></li>"; }

            // Si la charte n'est pas responsive, on ajoute un message.
            if (!estCharteResponsive) agrHtml += "<li><span class='ei_ergoqual_gly_ic_info' alt='" + ESD1_MESSAGES.Bar.responsive + "' title='" + ESD1_MESSAGES.Bar.ResponsiveTitle + "'> " + ESD1_MESSAGES.Bar.Responsive + "</span></li>";

            // bouton export
            if (ShowTool(ESD1_MESSAGES.Tools.Export)) {
                agrHtml += `
                <li>
                    <a class="ei_ergoqual_export" id="ergoqual_export" href="#">
                        ${ESD1_MESSAGES.Bar.Export}
                    </a>
                </li>
            `;
                iCptTools++;
            }

            // bouton aide
            if (ShowTool(ESD1_MESSAGES.Tools.Help)) {
                agrHtml += `<li><a class="ei_ergoqual_help" title="Aide, Frameid: ${window.refWin}" id="ergoqual_help" href="${ESD1_MESSAGES.Bar.Help_url}" target="_blank">${ESD1_MESSAGES.Bar.Help}</a></li>`;
                iCptTools++;
            }

            agrHtml += '</ul>';
        }

        var stateTranslation = false;

        agrHtml += '<ul class="ei_ergoqual_tools">';
        if(EXTENSION_ENV === 'dev') {
            agrHtml += `
                <li>
                    <a id="TranslateYContent" title="Glisser le contenu" class="ei_ergoqual_smartphone ei_icon_go_bottom adj_fsize" href="#"></a>
                </li> `;
        } 

        if (ShowTool(ESD1_MESSAGES.Tools.SmartHView)) {
            agrHtml += `
            <li>
                <a id="SmartHView" title="${ESD1_MESSAGES.Bar.SmartphoneVue}" class="ei_ergoqual_smartphone ei_ergoqual_gly_ic_phone_android" href="#"></a>
            </li>`;
            iCptTools++;
            
        }

        if (ShowTool(ESD1_MESSAGES.Tools.SmartVView)) {
            agrHtml += `
            <li>
                <a id="SmartVView" title="${ESD1_MESSAGES.Bar.SmartphoneLandscapeVue}" class="ei_ergoqual_smartphone_landscape ei_ergoqual_gly_ic_phone_android" href="#"></a>
            </li>`;
            iCptTools++;
        }

        if (ShowTool(ESD1_MESSAGES.Tools.TabHView)) {
            var tabHViewClickHandler = openWindowWithSettings('TabHView', gbEsd1Maq && gbEsd1Intranet ? 580 : 776, 1094);
            agrHtml += `
                <li>
                    <a title="${ESD1_MESSAGES.Bar.TabletVue}" class="ei_ergoqual_tablet ei_ergoqual_gly_ic_tablet_mac ei_ergoqual_landscape" href="#"></a>
                </li>
            `;
            iCptTools++;
        }

        if (ShowTool(ESD1_MESSAGES.Tools.TabVView)) {
            var tabVViewClickHandler = openWindowWithSettings('TabVView', gbEsd1Maq && gbEsd1Intranet ? 819 : 1015, 838);
            agrHtml += `
                <li>
                    <a title="${ESD1_MESSAGES.Bar.TabletLandscapeVue}" class="ei_ergoqual_tablet_landscape ei_ergoqual_gly_ic_tablet_mac" href="#"></a>
                </li>
            `;
            iCptTools++;
        }

        if (ShowTool(ESD1_MESSAGES.Tools.DeskView)) {
            var deskViewClickHandler = openWindowWithSettings('DeskView', gbEsd1Maq && gbEsd1Intranet ? 1190 : 1386, 838);
            agrHtml += `
                <li>
                    <a title="${ESD1_MESSAGES.Bar.DesktopVue}" class="ei_ergoqual_desktop ei_ergoqual_gly_ic_desktop_windows" href="#"></a>
                </li>
            `;
            iCptTools++;
        }

        if (ShowTool(ESD1_MESSAGES.Tools.ShowHidden)) {
            agrHtml += `
                <li>
                    <a title="${ESD1_MESSAGES.Bar.SeeHidden}" id="ergoqual_aff_tout" class="ei_ergoqual_gly_ic_remove_red_eye" href="#"></a>
                </li>
            `;
            iCptTools++;
        }

// Now you can append agrHtml to wherever it needs to be in your HTML structure


    // ****** END OF TOOLS SECTION ********//

        if ($(".ergoqual_diverror").length > 0) {
            agrHtml += '<li><a title="' + ESD1_MESSAGES.Bar.DisplayErrors + '" class="ei_ergoqual_gly_ic_expand_less" id="ergoqual_resize" href="#" onClick="';
            agrHtml += "event.stopPropagation();if($('.ergoqual_diverror').is(':visible')) {$('.ergoqual_diverror').slideUp('slow');$('#ergoqual_resize')";
            agrHtml += ".addClass('ei_ergoqual_gly_ic_expand_more').removeClass('ei_ergoqual_gly_ic_expand_less');}";
            agrHtml += "else {$('.ergoqual_diverror').slideDown('slow');$('#ergoqual_resize')";
            agrHtml += ".addClass('ei_ergoqual_gly_ic_expand_less').removeClass('ei_ergoqual_gly_ic_expand_more');}";
            agrHtml += '"></a></li>';
            iCptTools++;
        }

        agrHtml += '</ul>';
        agrHtml += '</div>';

        if (iCptTools > 0) {
            if ($(".ergoqual_diverror").length > 0 && gbEsd1Maq && !gbMaqEdge) {
                $(".ergoqual_diverror").before(agrHtml);
            }
            else {
                $("#ergoqual .ergoqual_top_menu").remove();
                //$(agrHtml).insertAfter(".ergoqual_top_menu_toggler");
                $("#ergoqual").prepend(agrHtml);
            }

        }
        
        // **** LISTENERS SECTION **** //
        document.getElementById('TranslateYContent')?.addEventListener('click', translateBodyByErgoqualHeight);
        $('#ergoqual').on('click', 'ergoqual_top_menu', toggleErrorDiv);
        $('#ergoqual').on('click', '#ergoqual_export', ergoqualExportCsv);
        $('#ergoqual').on('click', '#SmartHView', handleSmartHViewClick);
        $('#ergoqual').on('click', '#SmartVView', handleSmartVViewClick);
        $('#ergoqual_aff_tout').on('click', handleShowHidden);
        $('.ei_ergoqual_desktop').on('click', deskViewClickHandler);
        $('.ei_ergoqual_tablet_landscape').on('click', tabVViewClickHandler);
        $('.ei_ergoqual_tablet.ei_ergoqual_landscape').on('click', tabHViewClickHandler);
    // **** END OF LISTENERS **** //

        // S'il n'y a pas d'erreur et que le message 'Cette charte n'est pas responsive' est masqué, il faut passer la barre d'outils en flex-end.
        if (!$(".ergoqual_diverror").length && !estCharteResponsive) {
            $("div.ergoqual_top_menu").css("justify-content", "flex-end");
        }
    }

}

// ***********************************************************
// ErgoQual isInvalidAlt
//   Description
//  	calcule si l'image a une alternatve textuelle valide ou si elle est correctement ignorée
//   Input:
//     [Obj]     el                  [mandatory]        (element)
//                             
//   Output:
//     [String] intitulé de l'élement
// ***********************************************************
function isInvalidAlt(el) {
    if (
        (!$(el)[0].hasAttribute("role") ||
            ($(el)[0].hasAttribute("role") && ($(el).attr("role") != 'presentation'))
        ) &&
        (!$(el)[0].hasAttribute("aria-hidden") || ($(el).attr("aria-hidden") != 'true')) &&
        (
            (!($(el)[0].hasAttribute("alt") && ($(el).prop("tagName") == 'IMG'))) &&
            (!$(el)[0].hasAttribute("aria-label") || ($(el)[0].hasAttribute("aria-label") && !($(el).attr("aria-label") > ''))) &&
            (!$(el)[0].hasAttribute("title") || ($(el)[0].hasAttribute("title") && !($(el).attr("title") > ''))) &&
            (!getAriaLabelledByText(el))
        )
    ) {
        return true;
    }
    return false;
}

// ***********************************************************
// ErgoQual getAriaLabelledByText
//   Description
//  	calcule le passage de texte referencé par l'attribut aria-labelledby
//   Input:
//     [jQuery Obj]     el                  [mandatory]        (element)
//     [Boolean]        showVisualHidden    [mandatory]        (inclure les textes en masquage accessible)
//                             
//   Output:
//     [String] intitulé de l'élement
// ***********************************************************
function getAriaLabelledByText(el, showVisualHidden) {
    if (el.hasAttribute('aria-labelledby')) {
        let idLabel = el.getAttribute("aria-labelledby");
        if (idLabel && idLabel.indexOf(" ") > -1) {
            try {
                var text = [];
                console.log(idLabel.split(' '));
                idLabel.split(' ').forEach(function (id) {
                    text.push(getElementText(document.getElementById(id), showVisualHidden, false));
                });
                return text.join(' ');
            }
            catch (e) { console.log(e); }
        }
        else if (idLabel) {
            try {
                target = document.getElementById(idLabel);
                if (target) {
                    return getElementText(target, showVisualHidden, false);
                }
            }
            catch (e) { console.log(e); }
        }
        return null;
    }
    return null;
}

// ***********************************************************
// ErgoQual getDescriptionText
//   Description
//  	calcule le passage de texte referencé par l'attribut aria-describedBy
//   Input:
//     [jQuery Obj]     el                  [mandatory]        (element)
//     [Boolean]        showVisualHidden    [mandatory]        (inclure les textes en masquage accessible)
//                             
//   Output:
//     [String] intitulé de l'élement
// ***********************************************************
function getDescriptionText(el) {
    if (el.hasAttribute('aria-describedby')) {
        let idLabel = el.getAttribute("aria-describedby");
        if (idLabel) {
            try {
                target = document.getElementById(idLabel);
                if (target) {
                    return getElementText(target, true, false);
                }
            }
            catch (e) { console.log(e); }
        }
    }
    return null;
}

// ***********************************************************
// ErgoQual getElementText
//   Description
//  	calcule l'intitulé d'un élement
//   Input:
//     [jQuery Obj]     el                  [mandatory]        (element)
//     [Boolean]        showVisualHidden    [mandatory]        (inclure les textes en masquage accessible)
//                             
//   Output:
//     [String] intitulé de l'élement
// ***********************************************************
function getElementText(el, showVisualHidden, isRoot) {
    // TODO voir comment on range les fonctions en commun (ergoQual / ergoAlly)
    // ne pas continuer si l'élément n'est pas du texte ou une balise (si c'est par ex. un commentaire)
    if ([1, 3, 4].indexOf(el.nodeType) == -1) {
        return '';
    }

    // pour maintenir la compatibilité avec IE qui ne prend pas en charge les valeur par défaut des paramètres de fonction
    var showVisualHidden = (typeof showVisualHidden !== 'undefined') ? showVisualHidden : true;

    // pour maintenir la compatibilité avec IE qui ne prend pas en charge les valeur par défaut des paramètres de fonction
    var isRoot = (typeof isRoot !== 'undefined') ? false : true;

    var text = '';
    // Text node (3) or CDATA node (4) - return its text
    if ((el.nodeType === 3) || (el.nodeType === 4)) {
        text = el.nodeValue;
        // If node is an element (1) and an img, input[type=image], or area element, return its alt text
    } else if ((el.nodeType === 1) && (
        (el.tagName.toLowerCase() == 'img') ||
        (el.tagName.toLowerCase() == 'area') ||
        ((el.tagName.toLowerCase() == 'input') && el.getAttribute('type') && (el.getAttribute('type').toLowerCase() == 'image'))
    )) {
        if ((el.tagName.toLowerCase() == 'img') && (el.getAttribute('role') == 'presentation' || el.getAttribute('aria-hidden') == 'true')) {
            return '';
        }
        var labelledbyText = getAriaLabelledByText(el, true);
        if (labelledbyText) {
            text = labelledbyText;
        } else if (el.hasAttribute('aria-label')) {
            text = el.getAttribute('aria-label');
        } else {
            text = el.getAttribute('alt') || el.getAttribute('title') || '';
        }
        // Traverse children unless this is a script or style element
    } else if ((el.nodeType === 1) && !el.tagName.match(/^(script|style)$/i)) {
        classList = (typeof el.className === 'string') ? el.className.split(' ') : [];
        if (
            !((window.getComputedStyle(el, null).getPropertyValue("display") == "none" ||
                window.getComputedStyle(el, null).getPropertyValue("visibility") == "hidden" ||
                el.hasAttribute('hidden')
            ) &&
                !isRoot
            ) &&
            ((classList.indexOf("invisible") == -1 &&
                classList.indexOf("ei_sronly") == -1 && classList.indexOf("sr-only") == -1) ||
                showVisualHidden)
        ) {
            var children = el.childNodes;
            for (var i = 0, l = children.length; i < l; i++) {
                text += ' ' + getElementText(children[i], showVisualHidden, false);
                text = text.trim();
            }
        }

    }
    return text.trim();
}

function HtmlEncode(str2encode) {
    return str2encode.toString().replace("<", "&lt;").replace(">", "&gt;");
}

// ***********************************************************
// ErgoQual ShowTool
//   Description
//  	Vérifie si l'outil doit être affiché
//   Input:
//		(ESD1_MESSAGES.Tools) Outil à vérifier 
//   Output:
//      (bool) true si outil à afficher
// ***********************************************************
function ShowTool(iTool) {
    return (giEsd1sDisplayedTools & iTool) == iTool;
}


// *********************************************************** 
// Page & ErgoQual preparation
//   Description:
//     Prepare page for Ergo Qual.
//     Matérialise et injecte les résultats des analyses d'erreurs.
//   Input:
//     [String]          sLanguage      : Interface language
//   Output:
//     [Boolean] False if ErgoQual has already been checked, True otherwise.
// *********************************************************** 
function Esd1ErgoqualPrepare(modeInspect) {
    // End of ErgoQual if ErgoQual has already been checked
    
    // Si strictement mode Maquetteur (et pas en mode POC Maq Edge) on ne crée pas la barre si elle existe déja.
    if (gbEsd1Maq && !gbMaqEdge) {
        if ($("#ergoqual").length > 0) return false;
        if ($(".ergoqual_diverror").length > 0) return false;
        if ($(".ergoqual_top_menu").length > 0) return false;
    // Meme chose pour le reste mais on verifie que ergoqual_diverror
    } else {
        if ($("#ergoqual_diverror").length > 0) return false;
    }

    // injection du script et du conteneur ergoqual
    $("body").prepend('<div id="ergoqual"></div>');

    //injection du bouton plier/déplier
    $('#ergoqual').prepend(`
        <div class="ergoqual_top_menu_toggler">
            <a href="#" class="ei_ergoqual_opened" title="${ESD1_MESSAGES.Bar.DisplayBar}">&lt;</a>
        </div>
    `);

    $('#ergoqual').on('click', '.ergoqual_top_menu_toggler a', function(event) {
        event.stopPropagation();
        toggleAnalyticBar(event);
    });

    $("#ergoqual").append('<div id="ergoqual_diverror" class="blocmsg ergoqual_diverror"></div>');

    // La partie en dessous ne concerne pas la barre en mode inspect donc on sort si on est dans ce cas
    if(modeInspect) {
        //ajoute la zone de contenu
        $('#ergoqual').append('<div class="ergoqual_top_menu"></div>');

        //ajoute la zone qui contiendra les infos des applis
        $('div.ergoqual_top_menu').append(
            '<div id="ergoMenuContent" class="ergoqual_top_menu_content"></div>'
        );

        //ajoute le bouton de fermeture
        $('div.ergoqual_top_menu').append(
            '<div class="ergoqual_top_menu_closer"><a id="closeInspectBar" class="ei_ergoqual_gly_ic_clear" href="#" title="' +
            + ESD1_MESSAGES.Bar.DisplayBar + '"></div>'
        );

        $('#ergoqual').on('click', 'ergoqual_top_menu', toggleErrorDiv);
        $('#ergoqual').on('click', '#closeInspectBar', () => location.reload());
        
        return;
    };

    // Cas d'une LightBox ouverte : ajout des messages en haut de la LB
    $(".ei_blocmodal").each(function () {
        if (Esd1IsVisible($(this))) {
            $(this).children(".a_blocfctl").prepend('<div class="blocmsg ergoqual_diverror_lightbox"></div>');
        }
    });

    // Creation of an area for trace to be displayed
    $("#ergoqual_divlog").remove();
    if (gbEsd1ShowLog)
        $("body").prepend('<div id="ergoqual_divlog"> ------------ Log ----------------<br></div>');
    // Standard return
    return true;
}

function toggleAnalyticBar() {
    if ($('.ergoqual_top_menu_toggler > a').hasClass('ei_ergoqual_opened')) {
        if ($('.ergoqual_diverror').is(':visible')) {
            $('.ergoqual_diverror').slideUp('slow', function() {
                $('#ergoqual_resize').addClass('ei_ergoqual_gly_ic_expand_more').removeClass('ei_ergoqual_gly_ic_expand_less');
                $('.ergoqual_top_menu_toggler > a').removeClass('ei_ergoqual_opened');
                $('.ergoqual_top_menu_toggler > a').addClass('ei_ergoqual_closed');
                $('.ergoqual_top_menu').animate({ width: 'toggle' }, function() { 
                    $('.ergoqual_top_menu_toggler > a').html('&gt;');
                    $('#ergoqual').addClass('fit-content');
                });
            });
        } else {
            $('.ergoqual_top_menu_toggler > a').removeClass('ei_ergoqual_opened');
            $('.ergoqual_top_menu_toggler > a').addClass('ei_ergoqual_closed');
            $('.ergoqual_top_menu').animate({ width: 'toggle' }, function() { 
                $('.ergoqual_top_menu_toggler > a').html('&gt;');
                $('#ergoqual').addClass('fit-content');
            });
        }
    } else {
        $('.ergoqual_top_menu_toggler > a').removeClass('ei_ergoqual_closed');
        $('.ergoqual_top_menu_toggler > a').addClass('ei_ergoqual_opened');
        $('#ergoqual').removeClass('fit-content');
        $('.ergoqual_top_menu').animate({ width: 'toggle' }, function() { 
            $('.ergoqual_top_menu_toggler > a').html('&lt;');
        });
    }
}

function toggleErrorDiv() {
    if ($('.ergoqual_diverror').is(':visible')) {
        $('.ergoqual_diverror').slideUp('slow');
        $('#ergoqual_resize').addClass('ei_ergoqual_gly_ic_expand_more').removeClass('ei_ergoqual_gly_ic_expand_less');
    } else {
        $('.ergoqual_diverror').slideDown('slow');
        $('#ergoqual_resize').addClass('ei_ergoqual_gly_ic_expand_less').removeClass('ei_ergoqual_gly_ic_expand_more');
    }
}

// *********************************************************** 
//   Description: Highlight an error and add it to the error log.
// *********************************************************** 

function Esd1AddError(jTargetObject, oRule, sText0, sText1, sText2, sText3, sText4, sText5, sText6, sText7, sText8, sText9) {
    // Recherche de l'ID de l'objet posant problème, ou de son plus proche parent
    var sTargetId = ""; // ID de l'objet en erreur ou de son plus proche parent
    var jElem = jTargetObject;
    // var sWording = Esd1FormatText(oRule.ErrorId + ' : ' + oRule.Wording, sText0, sText1, sText2, sText3, sText4, sText5, sText6, sText7, sText8, sText9);
    var sText = Esd1FormatText(oRule.Wording, sText0, sText1, sText2, sText3, sText4, sText5, sText6, sText7, sText8, sText9);
    var sWording = oRule.ErrorId + ' : ' + sText;
    var sCategories = oRule.Categories.join(',');
    var sDomain = oRule.RDomain;

    //Trace(jTargetObject, "Création d'une erreur","..........................................................." + oRule.Wording);
    if ((gbEsd1AddOn || gbEsd1Maq) && !gbEsd1Force) {
        // CES 14/04/2021 Maq ne remonte pas les erreurs hors bloc appli, et l'extension ne remonte pas les erreurs hors contenu (en mode contenu) : 
        if (gbEsd1Maq && !($(jTargetObject).parents("div.a_blocappli").is("div"))) {
            //en mode ADD-ON, on ne génère les erreurs que pour le contenu du bloc appli, cela évite la pollution d'erreur avec le gabarit
            Trace(jTargetObject, sWording, " --- on ne trace pas l'erreur hors bloc appli");
            return true;
        }
        if (gbEsd1AddOn && (
            (!gbEsd1Intranet && ($(jTargetObject).parents(gContentSelector).length == 0)) ||
            (gbEsd1Intranet && !(($(jTargetObject).parents(gContentSelector).length !== 0) || ($(jTargetObject).parents('div.a_blocappli').is("div"))))
        )
        ) {
            Trace(jTargetObject, sWording, " --- on ne trace pas l'erreur hors contenu");
            return true;
        }
        if ($(jTargetObject).parents("#CYB1_VOC, #CYB1_VOC_LIGHTBOX").length > 0) {
            //on élimine VOC de la vérif
            Trace(jTargetObject, sWording, " --- on ne trace pas l'erreur VOC");
            return true;
        }
    }

    if ($(jTargetObject).parents("div.screen-diagnostics-block").length > 0) {
        //on élimine la barre devbooster de la vérif
        Trace(jTargetObject, sWording, " --- on ne trace pas l'erreur de la barre devbooster");
        return true;
    }

    // Recherche du premier Id disponible dans l'arborescence père (pour le notifier à l'appelant = le maquetteur)
    while ((sTargetId == "" || sTargetId == null || sTargetId == undefined) && jElem != undefined && jElem != null && jElem.length != 0) {
        sTargetId = jElem.attr("id");
        jElem = jElem.parent();
    }

    // Compteur des messages d'erreur/alerte/info.
    switch (oRule.Level) {
        case "err":
            giEsd1ErrorMessageCounter++;
            break;
        case "warn":
            giEsd1WarningMessageCounter++;
            break;
        case "info":
            giEsd1InfoMessageCounter++;
            break;
        default:
            break;
    }

    // incrémente le compteur des erreurs
    giEsd1ErrCounter++;

    // ajoute dans la liste des erreur à afficher dans ALLY window si en mode Ally
    if (gbEsd1ALLY && oRule.RGAA) {
        // var errRule = oRule;
        var errRule = Object.assign({}, oRule);
        // RP- on enrichi avec un peu d'info sur l"élément html pour faciliter le repérage depuis ALLY window    
        errRule["occurrence"] = jTargetObject.get(0).outerHTML.trim();
        gsEsd1ALLYAutoErrorRulesResults.push(errRule);
    }

    // Mise à jour du message d'erreur si l'erreur se situe dans un dialogue modal
    // (ne doit pas être effectué avant, car le flag d'erreur n'a pas besoin d'indiquer que l'on est dans une LB, contrairement au log complet)
    //  - Recherche si un parent est la Lightbox
    var jParentLB = jTargetObject.parents("div.ei_blocmodal");
    var bIsDisplayed = true; // indique si l'erreur trouvée se situe dans du code html visible
    var bIsLightBox = false; // indique si l'erreur trouvée se situe dans une ligthbox

    if (jParentLB.length > 0) {
        bIsLightBox = true;
        if (!Esd1IsVisible(jParentLB)) bIsDisplayed = false;

        // - Récupération de son Titre
        var sTitle = "";
        var jTitle = jParentLB.find("div.a_blocfctltitre p.a_titre2");

        if (jTitle.length > 0) sTitle = jTitle.first().text();
        if (sTitle.length > 0) sWording = sWording.substring(0, sWording.length - 1) + Esd1FormatText(ESD1_MESSAGES.Std.InLightbox.replace("_", " "), "'" + sTitle + "'");
        else sWording = sWording.substring(0, sWording.length - 1) + Esd1FormatText(ESD1_MESSAGES.Std.InLightbox.replace("_", ""), "");
    }
    else {
        jTargetObject.parents().each(function () {

            sTagName = $(this)[0].tagName.toLowerCase();

            if (bIsDisplayed && sTagName != "html" && sTagName != "body") {

                if (!Esd1IsVisible($(this))) {
                    bIsDisplayed = false;
                }
            }
        });

        if (!bIsDisplayed) {
            sWording = sWording.substring(0, sWording.length - 1) + ESD1_MESSAGES.Std.HiddenError;
        }
    }

    if (sDomain == "") {
        sDomain = "Internet - Intranet.";
    }

    // GSA 07/11/2019 : LOT6 T4-2019 - retrait des domaines sur le message affiché
    var sTemp = ' - ' + sCategories + ' : '
    sWording = sWording.replace(" : ", sTemp);

    // HTML ID of error highlight
    var sErrorId = 'ergoqual_E' + giEsd1ErrCounter;
    // Formatage du lien de la documentation
    var sErrorDocLink = Esd1FormatDocumentationUrl(oRule.DocLink);
    // Error highlighting 
    // valeur par défaut = erreur (FBC)
    if (oRule.Level == undefined || oRule.Level == null || oRule.Level == "")
        sLevel = kLEVEL_ERROR;
    jTargetObject.addClass('ergoqual_' + oRule.Level + '_highlight_' + giEsd1ErrCounter);
    // Error flag injection in HTML DOM
    var sHtmlHighlight;

    // Error log (inside HTML)
    if (gbEsd1ShowReport) {
        var sHtmlErrorLog;
        // si appel depuis l'add-on on ne fait disparaitre le smiley sur l'erreur précédente (on se contente de mettre le smiley sur l'erreur pointée)
            // appel de la fonction de gestion du focus en erreur quand le js est local à la page testée
            var glyphToShow = "";
            var classError = "";
            var classHighlight = "ergoqual_" + oRule.Level + "_highlight_" + giEsd1ErrCounter;;
            var classHighlighted = "ei_ergoqual_" + oRule.Level + "_highlighted";;
            var classHighlighting = "ei_ergoqual_" + oRule.Level + "_highlighting";
            switch (oRule.Level) {
                case "err":
                    glyphToShow = "ei_ergoqual_gly_ic_clear";
                    classError = "ei_ergoqual_error";
                    break;
                case "warn":
                    glyphToShow = "ei_ergoqual_gly_ic_warning";
                    classError = "ei_ergoqual_warning";
                    break;
                case "info":
                    glyphToShow = "ei_ergoqual_gly_ic_info";
                    classError = "ei_ergoqual_info";
                    break;
                default:
                    break;
            }

            sHtmlHighlight = '<a id="' + sErrorId + '"class="' + glyphToShow + '" name="' + sErrorId + '" title="' + sWording + ' ' + ESD1_MESSAGES.Std.ClickToGoErrorList + '" onclick="$(\'#ergoqual_E' + giEsd1ErrCounter + '\').removeClass(\'ergoqual_focus\');$(\'.ergoqual_diverror\').slideDown(\'slow\');$(\'#ergoqual_resize\').addClass(\'ei_ergoqual_gly_ic_expand_less\').removeClass(\'ei_ergoqual_gly_ic_expand_more\');" onblur="$(\'.' + classHighlight + '\').removeClass(\'' + classHighlighting + '\');" href="#">';
            var level = '';
            switch (oRule.Level) {
                case 'err':
                    level = ESD1_MESSAGES.ExportCsv.Error;
                    break;
                case 'warn':
                    level = ESD1_MESSAGES.ExportCsv.Alert;
                    break;
                case 'info':
                    level = ESD1_MESSAGES.ExportCsv.Info;
                    break;
                default:
                    level = oRule.Level;
            }
            sHtmlErrorLog = `<p>
                <a class="${classError} ${glyphToShow}" href="#"
                    data-ergoqual-counter="ergoqual_E${giEsd1ErrCounter}"
                    data-ergoqual-level="${level}"
                    data-ergoqual-errorid="${oRule.ErrorId}"
                    data-ergoqual-code="${encodeURIComponent(jTargetObject.prop("outerHTML").slice(0, 250).replace(/\;/g, '\,').replace(/(\r\n|\n|\r)/gm, ""))}"
                    data-ergoqual-text="${sText.replace(/\"/g, '\\"')}"                                                                                                           l-text="${sText.replace(/\"/g, '\\"')}"
                    title="${ESD1_MESSAGES.Std.SeeErrorObject}">
                    ${sWording}
                </a>`;
        
        /*TODO: API COMMUNICATION - TO merge with the rest , this is redundant */
        const apiDataErgoqual = {
            "data-ergoqual-counter": `ergoqual_E${giEsd1ErrCounter}`,
            "data-ergoqual-level": `${level}`,
            "data-ergoqual-errorid": `${oRule.ErrorId}`,
            "data-ergoqual-code": `${jTargetObject.prop("outerHTML").slice(0, 250).replace(/\;/g, '\,').replace(/(\r\n|\n|\r)/gm, "")}`,
            "data-ergoqual-text": `${sText.replace(/\"/g, '\\"')}`,
        };
        gsEsd1AllRulesResults.push(apiDataErgoqual)

        //Détermination automatique de la position de l'erreur en fonction de la balise courante
        Esd1AutoAddHighlight(jTargetObject, sHtmlHighlight);

        if (sErrorDocLink.length > 0) {
            // On affiche un lien hypertexte.
            if (sErrorDocLink.startsWith('https://ergonomie-ei-si.cm-cic.fr')) {
                sHtmlErrorLog += ' <a class="ei_ergoqual_doc ei_ergoqual_gly_ic_insert_drive_file" href="' + sErrorDocLink + '" target="_blank" title="' + ESD1_MESSAGES.Std.SeeDocumentationErgo + '">' + ESD1_MESSAGES.Std.DocumentationErgo + '</a>';
            }
            else if (sErrorDocLink.startsWith('http')) {
                sHtmlErrorLog += ' <a class="ei_ergoqual_doc ei_ergoqual_gly_ic_insert_drive_file" href="' + sErrorDocLink + '" target="_blank" title="' + ESD1_MESSAGES.Std.SeeDocumentation + '">' + ESD1_MESSAGES.Std.Documentation + '</a>';
            }
            // Exemple Sample, cas du addon qui n'a plus les url internes.
            else if (sErrorDocLink.startsWith('pagelfs')) {
                // On retire le paramètre pageLfs de l'URL. Ex : pagelfs=ListeRechercher => ListeRechercher
                sHtmlErrorLog += ' <span class="ei_ergoqual_doc ei_ergoqual_gly_ic_insert_drive_file" title="' + ESD1_MESSAGES.Std.SeeDocumentationLfs + '">SAMPLE: ' + sErrorDocLink.substring(sErrorDocLink.lastIndexOf("=") + 1, sErrorDocLink.length) + '</span>';
            }
            else if (sErrorDocLink.startsWith('ergo_')) {
                // console.log(CONFIG.ergoPageURL.replace('{0}', sErrorDocLink.substring(sErrorDocLink.lastIndexOf("_") + 1, sErrorDocLink.length)));

                // On retire le paramètre ergo_ du paramètre, et on le substitut dans l'url.
                sHtmlErrorLog += ' <a class="ei_ergoqual_doc ei_ergoqual_gly_ic_insert_drive_file" href="' + CONFIG.ergoPageURL.replace('{0}', sErrorDocLink.substring(sErrorDocLink.lastIndexOf("_") + 1, sErrorDocLink.length)) + '" target="_blank" title="' + ESD1_MESSAGES.Std.SeeDocumentationErgo + '">' + ESD1_MESSAGES.Std.Documentation + '</a>';
            }
            // Doc pixis, cas du addon qui n'a plus les url internes.
            else {
                // On retire le signet de la doc. Ex : 0990016403;signet:OBJ_3 => 0990016403
                var docPixis = sErrorDocLink.indexOf(";") != -1 ? sErrorDocLink.substring(0, sErrorDocLink.indexOf(";")) : sErrorDocLink;
                sHtmlErrorLog += ' <span class="ei_ergoqual_doc ei_ergoqual_gly_ic_insert_drive_file" title="' + ESD1_MESSAGES.Std.SeeDocumentationPixis + '">DOC PIXIS: ' + docPixis + '</span>';
            }
        }

        if (oRule.FaeLink) {
            sHtmlErrorLog += ' <a class="ei_ergoqual_doc ei_ergoqual_gly_ic_insert_drive_file" target="_blank" href="https://ergonomie-ei-si.cm-cic.fr/fr/accessibilite/faeaccessibilite.html?fae=' + encodeURIComponent(oRule.RGAA.Test) + '">' + ESD1_MESSAGES.Std.FAE.replace('%1', oRule.RGAA.Test) + '</a> ';
        }

        if (oRule.RGAA && oRule.RGAA.LienDoc) {
            sHtmlErrorLog += ' <a class="ei_ergoqual_doc ei_ergoqual_gly_ic_insert_drive_file" target="_blank" href="' + oRule.RGAA.LienDoc + '">' + ESD1_MESSAGES.Std.RGAA + '</a> ';
        }

        // Fermeture et itération du texte d'erreur
        sHtmlErrorLog += '</p>';
        $(".ergoqual_diverror").append(sHtmlErrorLog);

        // répétition de l'erreur dans la lightbox
        Trace(jTargetObject, "AddError " + sWording + "  ", "isLightbox=" + bIsLightBox + " IsDisplayed=" + bIsDisplayed);
        if (bIsLightBox && bIsDisplayed) {
            $(".ergoqual_diverror_lightbox").append(sHtmlErrorLog);
        }

        $('body').on('click', `[data-ergoqual-counter="ergoqual_E${giEsd1ErrCounter}"]`, function() {
            $('.ergoqual_focus').removeClass('ergoqual_focus');
            $('#ergoqual_E' + giEsd1ErrCounter).addClass('ergoqual_focus').focus();
            $('.ergoqual_diverror').slideUp('slow', function() {
                $('html,body').animate({ scrollTop: $('#' + sErrorId).offset().top }, 'slow');
            });
            $('#ergoqual_resize').addClass('ei_ergoqual_gly_ic_expand_more').removeClass('ei_ergoqual_gly_ic_expand_less');
            $('.' + classHighlight).addClass(classHighlighting);
        });
    
        $('body').on('mouseover', `[data-ergoqual-counter="ergoqual_E${giEsd1ErrCounter}"]`, function() {
            $('.' + classHighlight).addClass(classHighlighted);
        });
    
        $('body').on('mouseout', `[data-ergoqual-counter="ergoqual_E${giEsd1ErrCounter}"]`, function() {
            $('.' + classHighlight).removeClass(classHighlighted);
        });
    }

    // Notification au storyboarder de l'erreur
    if (window.external && ('Esd1ErgoQualNotification' in window.external))
        window.external.Esd1ErgoQualNotification(oRule.ErrorRule, sWording, sErrorDocLink, oRule.Level, sTargetId, sErrorId);
}

// *********************************************************** 
// Affiche une erreur si l'objet n'a pas déjé noté comme en erreur pour la règle et trace
//   Description:
//     Affiche une erreur si l'objet n'a pas déjé noté comme en erreur pour la règle et trace
//   Input:
//     [String]     sFunctionName  [mandatory]  (Nom de la fonction appelante)
//     [String]     sTrace         [mandatory]  (Texte de la trace)
//     [Bool]       bNoErrorFound  [mandatory]  (Indication d'une erreur déjà levée pour l'objet et pour la règle)
//     [jQuery Obj] jTargetObject  [mandatory]  (Objet jQuery posant problème)
//     [Object]     oRule          [mandatory]  (Objet Erreur)
//     [String]     sText0..sText9 [optional]   (Utilisation en Formattage de message d'erreur)               
//   Output:
//     [Bool] False
// *********************************************************** 
function Esd1AddTraceError(sFunctionName, sTrace, bNoErrorFound, jTargetObject, oRule, sText0, sText1, sText2, sText3, sText4, sText5, sText6, sText7, sText8, sText9) {
    Trace(jTargetObject, sFunctionName, sTrace);
    if (bNoErrorFound)
        Esd1AddError(jTargetObject, oRule, sText0, sText1, sText2, sText3, sText4, sText5, sText6, sText7, sText8, sText9);
    return false;
}

// *********************************************************** 
// Auto Add Highlight
//   Description:
//     Ajout l'indicateur d'erreur automatiquement, en fonction de l'élément en erreur.
//   Input:
//     [jQuery] jTargetObject  : Objet en erreur
//     [String] sHtmlHighlight : code HTML de l'indicateur d'erreur (càd de l'image)
//   Output:
//     [String] Documentation URL
// *********************************************************** 
function Esd1AutoAddHighlight(jTargetObject, sHtmlHighlight) {
    var jChildren;
    switch (jTargetObject[0].tagName.toLowerCase()) {
        // Inside (en général les éléments de type bloc)   
        case "address": case "bdo": case "blockquote": case "body": case "bq": case "caption": case "center": case "dd": case "div": case "dt":      // HTML4
        case "fieldset": case "form": case "h1": case "h2": case "h3": case "h4": case "h5": case "h6":                                              // HTML4
        case "ilayer": case "layer": case "legend": case "lh": case "li": case "listing": case "multicol": case "nobr":                              // HTML4
        case "p": case "pre": case "sidebar": case "td": case "th": case "xmp":                                                                      // HTML4
        case "article": case "aside": case "detail": case "dialog": case "figure": case "figurecaption": case "footer": case "header":
        case "hgroup": case "menu": case "nav": case "section": case "summary": // HTML5
            jTargetObject.prepend(sHtmlHighlight);
            break;

        // Before si possible (les éléments non affichables, ou dans le HEAD)   
        case "base": case "basefont": case "bgsound": case "comment": case "embed": case "meta":
        case "noembed": case "noframes": case "nolayer": case "noscript": case "object": case "server": case "style": case "script":
            var jParent = jTargetObject.parent().first();
            switch (jParent[0].tagName.toLowerCase()) {
                // Before   
                case "base": case "basefont": case "bgsound": case "comment": case "embed": case "meta":                                                          // Cas identique
                case "noembed": case "noframes": case "nolayer": case "noscript": case "object": case "server": case "style": case "script":                      // Cas identique
                case "area": case "col": case "colgroup": case "frame": case "frameset": case "head": case "optgroup": case "option": case "param": case "title": // Cas "parent"
                case "html":                                                                                                                                      // Racine
                    Esd1AutoAddHighlight(jParent, sHtmlHighlight);
                    break;
                default:
                    jTargetObject.before(sHtmlHighlight);
                    break;
            }
            break;

        // Sur un parent possible (on relance l'opération sur le parent)   
        case "area": case "col": case "colgroup": case "frame": case "frameset": case "head": case "optgroup": case "option": case "param": case "title": // HTML4
        case "datalist", "source": case "track": // HTML5
            Esd1AutoAddHighlight(jTargetObject.parent().first(), sHtmlHighlight);
            break;

        // Sur un enfant possible (sinon : before)   
        case "dir": case "ol": case "ul":
            jChildren = jTargetObject.find("li");
            if (jChildren.length > 0)
                jChildren.first().prepend(sHtmlHighlight);
            else
                jTargetObject.before(sHtmlHighlight);
            break;
        case "html":
            jChildren = jTargetObject.find("body");
            if (jChildren.length > 0)
                jChildren.first().prepend(sHtmlHighlight);
            else
                jTargetObject.before(sHtmlHighlight);
            break;
        case "tbody": case "tfoot": case "thead": case "tr":
            jChildren = jTargetObject.find("th, td");
            if (jChildren.length > 0)
                jChildren.first().prepend(sHtmlHighlight);
            else
                jTargetObject.before(sHtmlHighlight);
            break;
        case "dl":
            jChildren = jTargetObject.find("dd, dt");
            if (jChildren.length > 0)
                jChildren.first().prepend(sHtmlHighlight);
            else
                jTargetObject.before(sHtmlHighlight);
            break;

        default:
            jTargetObject.before(sHtmlHighlight);
            break;
    }
}

// *********************************************************** 
// Format documentation URL
//   Description:
//     If needed, format the documentation URL.
//   Input:
//     [String] sDocLink : Documentation link
//   Output:
//     [String] Documentation URL
// *********************************************************** 
function Esd1FormatDocumentationUrl(sDocLink) {

    var pixisDocURL = "";
    var sampleURL = "";

    // On récupère les URL internes dans le fichier de config. Si fichier non présent, exception, donc on est en addon.
    try { pixisDocURL = CONFIG.pixisDocURL; } catch (exception) { }
    try { sampleURL = CONFIG.sampleURL; } catch (exception) { }

    if (sDocLink == undefined || sDocLink.length == 0)
        return "";
    if (sDocLink.indexOf("http") >= 0)
        return sDocLink;
    if (sDocLink.indexOf("pagelfs") >= 0)
        return sampleURL + sDocLink;
    if (sDocLink.indexOf("ergo_") >= 0)
        return sDocLink;


    //par défaut on considère que c'est un lien vers le catalogue Ergo
    return pixisDocURL + sDocLink;
}

// Lit le fichier de config.
//function GetConfig(key) {
//    var result = "";
//    try {
//        result = eval(key);
//    } catch (exception) { }
//    return result;
//}

// *********************************************************** 
// Indique si un noeud parent correspond à la sélection recherchée
//   Input:
//    el  : élément Jquery sur lequel porte la recherche
//	  sSearch : le sélecteur à chercher
//   Output:
//     [Bool] vrai si un élément est trouvé
// *********************************************************** 
function Esd1IsExistInParent(el, sSearch) {
    // TODO : remplacer tout le contenu de la fonction par : 
    //return (el.parents(sSearch).length > 0)



    var bTrouve = false;
    // on parcourt tous les noeuds parents pour trouver un éventuel objet de séletion multiple
    el.parents().each(function () {
        if ($(this).eq(0).is(sSearch)) {
            bTrouve = true;
            return true;
        }
    })
    return bTrouve;
}

// *********************************************************** 
// Indique si le noeud est visible
// Ne pas utiliser pour exclure des nœuds du test d'une règle, car il faut rechercher les erreurs présentes dans les lightboxes ou dans les blocs pliés
//   Input:
//    jQueryObject  : élément Jquery sur lequel porte la recherche
//   Output:
//     [Bool] vrai si un élément est trouvé
// *********************************************************** 
function Esd1IsVisible(jQueryObject) {
    var bIsVisible = true;

    if (jQueryObject.css("display") == "none") bIsVisible = false;

    jQueryObject.parents().each(function () {
        if (bIsVisible && $(this).css("display") == "none")
            bIsVisible = false;
    });
    if (!bIsVisible)
        return false;

    var oPosition = jQueryObject.offset()
    if (oPosition.top < 0 || oPosition.left < 0)
        return false;

    return true;
}

// *********************************************************** 
// Vérifie que les 2 chaînes sont égales, en ignorant la casse
//   Input:
//    sString1 : Chaîne 1
//    sString2 : Chaîne 2
//   Output:
//     [Bool] Vrai si l'objet jQuery est bien du type recherché
// *********************************************************** 
function Esd1StringCompareNoSensitive(sString1, sString2) {
    return ((sString1 + "").toLowerCase() == (sString2 + "").toLowerCase());
}

// *********************************************************** 
// Vérifie que la balise de l'objet jQuery est bien du type recherché
//   Input:
//    jQueryObject : Élément Jquery sur lequel porte la recherche
//    sTagName     : Type de nœud recherché
//   Output:
//     [Bool] Vrai si l'objet jQuery est bien du type recherché
// *********************************************************** 
function Esd1IsTag(jQueryObject, sTagName) {
    if (jQueryObject == null || jQueryObject == undefined)
        return false;

    var oEQ;
    if (jQueryObject.eq)
        oEQ = jQueryObject.eq(0);
    else
        return false;

    var sEqTagName;
    if (oEQ.prop)
        sEqTagName = oEQ.prop("tagName");
    else
        return false;

    if (sEqTagName == null)
        return false;

    return (sEqTagName.toLowerCase() == sTagName.toLowerCase());
}

// *********************************************************** 
// Vérifie que la balise de l'objet jQuery est la bonne, et crée une erreur si besoin
//   Input:
//     [String]     sFunctionName  [mandatory]  (Nom de la fonction appelante)
//     [jQuery Obj] jObject        [mandatory]  (Objet jQuery sur lequel effectuer le test)
//     [String]     sTagName       [mandatory]  (Nom de la balise à vérifier)
//     [String]     sTraceIfNok    [mandatory]  (Texte de la trace si NOK)
//     [Bool]       bNoErrorFound  [mandatory]  (Indication d'une erreur déjà levée pour l'objet et pour la règle)
//     [jQuery Obj] jTargetObject  [mandatory]  (Objet jQuery (racine) posant problème)
//     [Object]     oRule          [mandatory]  (Objet Erreur)
//     [String]     sText0..sText9 [optional]   (Utilisation en Formattage de message d'erreur)               
//   Output:
//     [Bool] bNoErrorFound si OK, False si erreur 
// *********************************************************** 
function Esd1CheckTag(sFunctionName, jObject, sTagName, sTraceIfNok, bNoErrorFound, jTargetObject, oRule, sText0, sText1, sText2, sText3, sText4, sText5, sText6, sText7, sText8, sText9) {
    if (!Esd1IsTag(jObject, sTagName)) {
        return Esd1AddTraceError(sFunctionName, sTraceIfNok, bNoErrorFound, jTargetObject, oRule, sText0, sText1, sText2, sText3, sText4, sText5, sText6, sText7, sText8, sText9);
    }
    else {
        return bNoErrorFound;
    }
}

// *********************************************************** 
// Vérifie qu'une classe est bien présente sur un  objet jQuery, et crée une erreur si besoin
//   Input:
//     [String]     sFunctionName  [mandatory]  (Nom de la fonction appelante)
//     [jQuery Obj] jObject        [mandatory]  (Objet jQuery sur lequel effectuer le test)
//     [String]     sClassName     [mandatory]  (Nom de la classe à rechercher)
//     [String]     sTraceIfNok    [mandatory]  (Texte de la trace si NOK)
//     [Bool]       bNoErrorFound  [mandatory]  (Indication d'une erreur déjà levée pour l'objet et pour la règle)
//     [jQuery Obj] jTargetObject  [mandatory]  (Objet jQuery (racine) posant problème)
//     [Object]     oRule          [mandatory]  (Objet Erreur)
//     [String]     sText0..sText9 [optional]   (Utilisation en Formattage de message d'erreur)               
//   Output:
//     [Bool] bNoErrorFound si OK, False si erreur 
// *********************************************************** 
function Esd1CheckClass(sFunctionName, jObject, sClassName, sTraceIfNok, bNoErrorFound, jTargetObject, oRule, sText0, sText1, sText2, sText3, sText4, sText5, sText6, sText7, sText8, sText9) {
    if (!jObject.hasClass(sClassName)) {
        return Esd1AddTraceError(sFunctionName, sTraceIfNok, bNoErrorFound, jTargetObject, oRule, sText0, sText1, sText2, sText3, sText4, sText5, sText6, sText7, sText8, sText9);
    }
    else {
        return bNoErrorFound;
    }
}

// *********************************************************** 
// Vérifie qu'une classe est bien absente de l'objet jQuery, et crée une erreur si besoin
//   Input:
//     [String]     sFunctionName  [mandatory]  (Nom de la fonction appelante)
//     [jQuery Obj] jObject        [mandatory]  (Objet jQuery sur lequel effectuer le test)
//     [String]     sClassName     [mandatory]  (Nom de la classe à rechercher)
//     [String]     sTraceIfNok    [mandatory]  (Texte de la trace si NOK)
//     [Bool]       bNoErrorFound  [mandatory]  (Indication d'une erreur déjà levée pour l'objet et pour la règle)
//     [jQuery Obj] jTargetObject  [mandatory]  (Objet jQuery (racine) posant problème)
//     [Object]     oRule          [mandatory]  (Objet Erreur)
//     [String]     sText0..sText9 [optional]   (Utilisation en Formattage de message d'erreur)               
//   Output:
//     [Bool] bNoErrorFound si OK, False si erreur 
// *********************************************************** 
function Esd1CheckNoClass(sFunctionName, jObject, sClassName, sTraceIfNok, bNoErrorFound, jTargetObject, oRule, sText0, sText1, sText2, sText3, sText4, sText5, sText6, sText7, sText8, sText9) {
    if (jObject.hasClass(sClassName)) {
        return Esd1AddTraceError(sFunctionName, sTraceIfNok, bNoErrorFound, jTargetObject, oRule, sText0, sText1, sText2, sText3, sText4, sText5, sText6, sText7, sText8, sText9);
    }
    else {
        return bNoErrorFound;
    }
}

// *********************************************************** 
// Vérifie que l'attribut de l'objet jQuery est bien valorisé, et crée une erreur si besoin
//   Input:
//     [String]     sFunctionName  [mandatory]  (Nom de la fonction appelante)
//     [jQuery Obj] jObject        [mandatory]  (Objet jQuery sur lequel effectuer le test)
//     [String]     sAttrName      [mandatory]  (Nom de l'attribut à rechercher)
//     [String]     sVal           [mandatory]  (Valorisation à trouver pour l'attribut)
//     [String]     sTraceIfNok    [mandatory]  (Texte de la trace si NOK)
//     [Bool]       bNoErrorFound  [mandatory]  (Indication d'une erreur déjà levée pour l'objet et pour la règle)
//     [jQuery Obj] jTargetObject  [mandatory]  (Objet jQuery (racine) posant problème)
//     [Object]     oRule          [mandatory]  (Objet Erreur)
//     [String]     sText0..sText9 [optional]   (Utilisation en Formattage de message d'erreur)               
//   Output:
//     [Bool] bNoErrorFound si OK, False si erreur 
// *********************************************************** 
function Esd1CheckAttr(sFunctionName, jObject, sAttrName, sVal, sTraceIfNok, bNoErrorFound, jTargetObject, oRule, sText0, sText1, sText2, sText3, sText4, sText5, sText6, sText7, sText8, sText9) {
    if (!Esd1StringCompareNoSensitive(jObject.attr(sAttrName), sVal)) {
        return Esd1AddTraceError(sFunctionName, sTraceIfNok, bNoErrorFound, jTargetObject, oRule, sText0, sText1, sText2, sText3, sText4, sText5, sText6, sText7, sText8, sText9);
    }
    else {
        return bNoErrorFound;
    }
}

// *********************************************************** 
// IgnoreRule
//   Description:
//     La règle donnée en paramètre est-elle à ignorer ?
//   Input:
//     [Object]  oRule         : règle à tester
//   Output:
//     [Boolean] Vrai s'il faut ignorer la règle
// *********************************************************** 
function Esd1IgnoreRule(oRule) {
    //RP- en mode ALLY on filtre sur les règles de la catégorie "Accessibilité"
    //RP- TODO revoir classification par Domaine, Level etc. et surout rajout des infos RGAA
   
    if (gbEsd1ALLY) {
        if (!(oRule.Categories.includes('Accessibilité') || oRule.Categories.includes('Accessibility')) && !oRule.RGAA) {
            return true;
        }
        else {
            //RP- on profite en passant pour renseigner la règle dans la liste gsEsd1ALLYAutoRulesResults
            gsEsd1ALLYAutoRulesResults.push(oRule);
        }
    }

    // si la règle n'est pas internet/intranet, on filtre en fonction du contexte d'appel
    if (oRule.RDomain != "") {
        // Trace($(this), oRule.Wording, " oRule.RDomain=" + oRule.RDomain + "   - gbEsd1Internet=" + gbEsd1Internet + "   - gbEsd1Intranet=" + gbEsd1Intranet);
        // La règle s'applique-t-elle à l'Internet ?
        if (oRule.RDomain == "internet" && !gbEsd1Internet) {
            Trace($(this), oRule.Wording, " règle ignorée car la règle est internet et que la page est intranet");
            return true;
        }
        // La règle s'applique-t-elle à l'Intranet ?
        if (oRule.RDomain == "intranet" && !gbEsd1Intranet) {
            Trace($(this), oRule.Wording, " règle ignorée car la règle est intranet et que la page est internet");
            return true;
        }
    }

    var iLevel = 0; // Niveau de la règle (1: Error, 2: Warnings, 3: Info)
    switch (oRule.Level) {
        case "err":
            iLevel = 1;
            break;
        case "warn":
            iLevel = 2;
            break;
        case "info":
            iLevel = 3;
            break;
    }

    // Niveau de la règle
    if (giEsd1ErrorLevel < iLevel) {
        Trace($(this), oRule.Wording, " règle ignorée car inférieure au niveau demandé(ex on est sur un warning et on demande les err)");
        return true;
    }
    // Règles à ignorer
    for (i = 0; i < gaEsd1sIgnoredRules.length; i++) {
        if (gaEsd1sIgnoredRules[i] == oRule.ErrorRule) {
            Trace($(this), oRule.Wording, " règle ignorée car elle est présente dans la liste noire transmise");
            return true;
        }
    }
    return false;
}

// *********************************************************** 
// Get image source name
//   Description:
//     Récupère le nom de l'image, sans son chemin.
//   Input:
//     [jQuery object] jImage : Image dont il faur récupérer le nom
//   Output:
//     [String] Le nom de l'image, sans son chemin
// *********************************************************** 
function Esd1GetImageSrc(jImage) {
    try {
        return jImage.attr('src').replace(greImageWithoutPath, "$1").toLowerCase();
    } catch (exception) {
        return "";
    }
}

// *********************************************************** 
// Get standard button type
//   Description:
//     Récupère le type de bouton standard.
//   Input:
//     [jQuery object] jImage : Image dont il faur récupérer le nom
//   Output:
//     [String] Le type du bouton standard
// *********************************************************** 
function Esd1GetStdButtonType(jSrc) {
    var sSrc = Esd1GetImageSrc(jSrc);
    switch (sSrc) {
        case "abandonner.gif":
            return ESD1_MESSAGES.Buttons.Cancel;
        case "ajouter.gif":
            return ESD1_MESSAGES.Buttons.Add;
        case "archiver.gif":
            return ESD1_MESSAGES.Buttons.Archive;
        case "calculer.gif":
            return ESD1_MESSAGES.Buttons.Calculate;
        case "confirmer.gif":
        case "confirmer_h.gif":
            return ESD1_MESSAGES.Buttons.Confirm;
        case "controler.gif":
            return ESD1_MESSAGES.Buttons.Check;
        case "copier.gif":
            return ESD1_MESSAGES.Buttons.Copy;
        case "dernier.gif":
            return ESD1_MESSAGES.Buttons.Last;
        case "desarchiver.gif":
            return ESD1_MESSAGES.Buttons.Dearchive;
        case "effacer.gif":
        case "supprimer.gif":
        case "supprimer_h.gif":
            return ESD1_MESSAGES.Buttons.Del;
        case "enregistrer.gif":
        case "sauvegarder.gif":
            return ESD1_MESSAGES.Buttons.Save;
        case "envoyer.gif":
            return ESD1_MESSAGES.Buttons.Send;
        case "imprimer.gif":
            return ESD1_MESSAGES.Buttons.Print;
        case "modifier.gif":
            return ESD1_MESSAGES.Buttons.Change;
        case "non.gif":
            return ESD1_MESSAGES.Buttons.No;
        case "ok.gif":
            return ESD1_MESSAGES.Buttons.Ok;
        case "oui.gif":
            return ESD1_MESSAGES.Buttons.Yes;
        case "parcourir.gif":
            return ESD1_MESSAGES.Buttons.Browse;
        case "ldetpre.gif":
        case "precedent.gif":
            return ESD1_MESSAGES.Buttons.Previous;
        case "rechercher.gif":
            return ESD1_MESSAGES.Buttons.Search;
        case "reinitialiser.gif":
            return ESD1_MESSAGES.Buttons.Reset;
        case "retour.gif":
            return ESD1_MESSAGES.Buttons.Back;
        case "selectionner.gif":
            return ESD1_MESSAGES.Buttons.Select;
        case "simuler.gif":
            return ESD1_MESSAGES.Buttons.Simulate;
        case "souscrire.gif":
            return ESD1_MESSAGES.Buttons.Subscribe;
        case "ldetsui.gif":
        case "suivant.gif":
            return ESD1_MESSAGES.Buttons.Next;
        case "telecharger.gif":
            return ESD1_MESSAGES.Buttons.Download;
        case "terminer.gif":
            return ESD1_MESSAGES.Buttons.End;
        case "transmettre.gif":
            return ESD1_MESSAGES.Buttons.Transmit;
        case "valider.gif":
        case "valider_h.gif":
            return ESD1_MESSAGES.Buttons.Validate;
        case "valconf.gif":
            return ESD1_MESSAGES.Buttons.ValConf;
        default:
            return ESD1_MESSAGES.Buttons.Unknown;
    }
}

// *********************************************************** 
// Get generic button type
//   Description:
//     Récupère le type de bouton générique.
//   Input:
//     [jQuery object] jImage : Racine du bouton générique dont il faut déterminer le type
//   Output:
//     [String] Le type du bouton générique
// *********************************************************** 
function Esd1GetGenericButtonType(jSrc) {
    var jButtonType = jSrc.children().eq(0);
    if (jButtonType == null || jButtonType == undefined) return ESD1_MESSAGES.Buttons.Unknown;
    if (jButtonType.hasClass("ei_btn_typ_cancel"))
        return ESD1_MESSAGES.Buttons.Cancel;
    if (jButtonType.hasClass("ei_btn_typ_quit"))
        return ESD1_MESSAGES.Buttons.Quit;
    if (jButtonType.hasClass("ei_btn_typ_add"))
        return ESD1_MESSAGES.Buttons.Add;
    if (jButtonType.hasClass("ei_btn_typ_calc"))
        return ESD1_MESSAGES.Buttons.Calculate;
    if (jButtonType.hasClass("ei_btn_typ_confirm"))
        return ESD1_MESSAGES.Buttons.Confirm;
    if (jButtonType.hasClass("ei_btn_typ_copy"))
        return ESD1_MESSAGES.Buttons.Copy;
    if (jButtonType.hasClass("ei_btn_typ_check"))
        return ESD1_MESSAGES.Buttons.Check;
    if (jButtonType.hasClass("ei_btn_typ_last"))
        return ESD1_MESSAGES.Buttons.Last;
    if (jButtonType.hasClass("ei_btn_typ_send"))
        return ESD1_MESSAGES.Buttons.Send;
    if (jButtonType.hasClass("ei_btn_typ_ok"))
        return ESD1_MESSAGES.Buttons.Ok;
    if (jButtonType.hasClass("ei_btn_typ_yes"))
        return ESD1_MESSAGES.Buttons.Yes;
    if (jButtonType.hasClass("ei_btn_typ_no"))
        return ESD1_MESSAGES.Buttons.No;
    if (jButtonType.hasClass("ei_btn_typ_prev"))
        return ESD1_MESSAGES.Buttons.Previous;
    if (jButtonType.hasClass("ei_btn_typ_browse"))
        return ESD1_MESSAGES.Buttons.Browse;
    if (jButtonType.hasClass("ei_btn_typ_search"))
        return ESD1_MESSAGES.Buttons.Search;
    if (jButtonType.hasClass("ei_btn_typ_write"))
        return ESD1_MESSAGES.Buttons.Write;
    if (jButtonType.hasClass("ei_btn_typ_phone"))
        return ESD1_MESSAGES.Buttons.Phone;
    if (jButtonType.hasClass("ei_btn_typ_diary"))
        return ESD1_MESSAGES.Buttons.PickDate;
    if (jButtonType.hasClass("ei_btn_typ_reset"))
        return ESD1_MESSAGES.Buttons.Reset;
    if (jButtonType.hasClass("ei_btn_typ_back"))
        return ESD1_MESSAGES.Buttons.Back;
    if (jButtonType.hasClass("ei_btn_typ_save"))
        return ESD1_MESSAGES.Buttons.Save;
    if (jButtonType.hasClass("ei_btn_typ_subscribe"))
        return ESD1_MESSAGES.Buttons.Subscribe;
    if (jButtonType.hasClass("ei_btn_typ_next"))
        return ESD1_MESSAGES.Buttons.Next;
    if (jButtonType.hasClass("ei_btn_typ_del"))
        return ESD1_MESSAGES.Buttons.Del;
    if (jButtonType.hasClass("ei_btn_typ_end"))
        return ESD1_MESSAGES.Buttons.End;
    if (jButtonType.hasClass("ei_btn_typ_validate"))
        return ESD1_MESSAGES.Buttons.Validate;
    if (jButtonType.hasClass("ei_btn_typ_valconf"))
        return ESD1_MESSAGES.Buttons.ValConf;
    if (jButtonType.hasClass("ei_btn_typ_change"))
        return ESD1_MESSAGES.Buttons.Change;
    if (jButtonType.hasClass("ei_btn_typ_print"))
        return ESD1_MESSAGES.Buttons.Print;
    if (jButtonType.hasClass("ei_btn_typ_archive"))
        return ESD1_MESSAGES.Buttons.Archive;
    if (jButtonType.hasClass("ei_btn_typ_dearchive"))
        return ESD1_MESSAGES.Buttons.Dearchive;
    if (jButtonType.hasClass("ei_btn_typ_select"))
        return ESD1_MESSAGES.Buttons.Select;
    if (jButtonType.hasClass("ei_btn_typ_gen_back"))
        return ESD1_MESSAGES.Buttons.Backward;
    if (jButtonType.hasClass("ei_btn_strong"))
        return ESD1_MESSAGES.Buttons.Highlighted;
    if (jButtonType.hasClass("ei_btn_typ_gen_std"))
        return ESD1_MESSAGES.Buttons.Generic;
    if (jButtonType.hasClass("ei_btn_fn_backward"))
        return ESD1_MESSAGES.Buttons.CustomBackward;
    if (jButtonType.hasClass("ei_btn_fn_forward"))
        return ESD1_MESSAGES.Buttons.CustomForward;
    if (jButtonType.hasClass("ei_btn_fn_tertiary"))
        return ESD1_MESSAGES.Buttons.Custom;
    if (jButtonType.hasClass("ei_btn_typ_refresh"))
        return ESD1_MESSAGES.Buttons.Refresh;
    if (jButtonType.hasClass("ei_btn_typ_transmit"))
        return ESD1_MESSAGES.Buttons.Transmit;
    if (jButtonType.hasClass("ei_btn_typ_report"))
        return ESD1_MESSAGES.Buttons.Transmit;

    return ESD1_MESSAGES.Buttons.Unknown;
}

//Récupère la position d'un bouton primaire, secondaire ou tertiaire
function Esd1GetGenericButtonPosition(jButtonPosition) {

    if (!jButtonPosition) return ESD1_MESSAGES.Buttons.Unknown;

 
    if (jButtonPosition.hasClass("ei_mainbutton"))
        return ESD1_MESSAGES.Buttons.Primary;
    if (jButtonPosition.hasClass("ei_secondarybutton"))
        return ESD1_MESSAGES.Buttons.Secondary;
    if (jButtonPosition.hasClass("ei_tertiarybutton"))
        return ESD1_MESSAGES.Buttons.Tertiary;

    return ESD1_MESSAGES.Buttons.Unknown;
}

// *********************************************************** 
// Format text
//   Description:
//     Retourne un texte formaté (équivalent du String.Format C#)
//   Input:
//     [string] sFormat : Format tu texte de sortie 
//     [string] sText0  : 1ère mise en forme
//     ... 
//     [string] sText9 : 10ème mise en forme 
//   Output:
//     [String] Le texte mis en forme.
// *********************************************************** 
function Esd1FormatText(sFormat, ...args) {
    if (sFormat == null || sFormat == undefined || !sFormat.replace)
        return "";

    let sText = sFormat;

    // Pour le MAQ on retire les erreurs techniques affichées en fin de règle ' ({x}).'.
    // TODO GLA : à remplacer par une méthode plus propore qui isole le message technique des sTextx.
    if (gbEsd1Maq && sText.substring(sText.length, sText.length - 2) == ').') sText = sText.replace(/\s\({[0-9]}\)\./gi, '');
    
    args.forEach((v,k) => {
        var regex = new RegExp('[{]' + k + '[}]', 'gi');
        if (v) sText = sText.replace(regex, v);
        else sText = sText.replace(regex, '');
    });

    return sText;
}

// *********************************************************** 
// Set Visible
//   Description:
//     
//   Input:
//     Identification de l'objet jQuery
//   Output:
//     [String] Un ID HTML unique
// *********************************************************** 
function Esd1ToggleVisible(objId) {
    // Initialisation de l'objet
    var id = objId;
    var className = "affichee";

    if ($(id).hasClass(className)) {
        $(id).removeClass(className);
    }
    else {
        if ($(id).css("display") == 'none') {
            $(id).addClass(className);
        }
        else {
            $(id).children().each(function () {
                if ($(this).css("display") == 'none') {
                    $(this).addClass(className);
                }
            });
        }
    }
}

// *********************************************************** 
// Get Unique ID
//   Description:
//     Génère un ID unique (pour ensuite retrouver l'élément, ou ne pas compter 2x un élément).
//   Input:
//     N/A
//   Output:
//     [String] Un ID HTML unique
// *********************************************************** 
function Esd1GetUniqueId() {
    giEsd1IdGeneratorCounter++;
    return "ESD1_ergoqual_" + giEsd1IdGeneratorCounter;
}

// *****************************************************
// *** Tools Fonction qui renvoie le nombre de Tag de type input dans l'objet passé en paramètre
// *****************************************************
function Esd1NbInputTagInObject(jQueryObject) {
    var iNbInput;
    iNbInput = $(jQueryObject).find('input').not('[type="hidden"], [type="button"], [type="image"], [type="submit"], [type="reset"]').length;
    iNbInput += $(jQueryObject).find('textarea').length;
    iNbInput += $(jQueryObject).find('select').length;
    return iNbInput;
}

// Fonction pour vérifier si l'élément donné a du texte visible
function hasTextVisible(element) {
    // Cloner l'élément pour éviter de modifier l'original
    let clonedElement = $(element).clone();

    //Enlever les éléments invisibles du clone pour pouvoir trimmer seulement sur les visibles
    clonedElement.find('[style*="display: none"], .ei_sronly, .invisible, sr-only').each(function () {
        $(this).remove();
    });

    // Supprimer les espaces vides du contenu textuel de l'élément cloné
    let trimmedText = clonedElement.text().trim();

    // Renvoyer true si le texte trimmé n'est pas vide, indiquant du texte visible
    return trimmedText.length > 0;
}
  
/**
 * fonction qui renvoie "true" si le lien a une icône seule, sinon "false"
 * @param {*} refLink : l'element DOM <a>
 */

// Cette fonction vérifie si un lien donné (refLink) est un lien icône 
function isIconOnlyLink(refLink) {
    // fonction anonyme pour eviter de réecrire ce test plusieurs fois 
    let hasBefContent = el => window.getComputedStyle(el, ':before').getPropertyValue("content") !== "none";

    // si le lien à du texte visible, ce n'est pas un lien à icône unique => on retourne false
    if (hasTextVisible($(refLink)))  {
        return false;
    }

    // si le lien contient un :before content comme fils direct => lien a icône seul (cas simple) on retourne true 
    if (hasBefContent(refLink)) {
        return true;
        // sinon vérifier si les spans fils du lien on un :before avec content => si on en trouve un on renvoi true
    } else {
        // le premier find ne retourne un tableau de span trouvés, le get permet de le transformer en un tableau normal (sans jquery) pour pouvoir utiliser le find classique de js pour faire notre test)
        spanWithBeforeContent = $(refLink).find("span").get().find(el => hasBefContent(el));
        //Si on a ni trouvé du texte ni une icône dans les spans enfants on retourne false (car ce n'est pas un lien a icône seule mais un lien vide)
        return spanWithBeforeContent ? true : false;
    }
};

function escapeRegExp(stringToGoIntoTheRegex) {
    // return stringToGoIntoTheRegex.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    let escaped = stringToGoIntoTheRegex.replace(/[-\/\\^$*+?.()|[\]{},;:_]/g, ' ');
    return escaped.trim().replace(/\s+/g, " ");
}

/**
 * vérifie si textToTest est inclus dans textContent
 * @param {*} textContent 
 * @param {*} textToTest 
 * @returns 
 */
function isInclude(textContent, textToTest) {
    let stringToGoIntoTheRegex = escapeRegExp(textContent); // on prépare une variable pour convertir en regexp
    let regTextContent = new RegExp(stringToGoIntoTheRegex, 'gi');

    toTest = escapeRegExp(textToTest);
    // variable intermédiaire obligatoire, la comparaison directe ne fonctionne pas
    return regTextContent.test(toTest);
}

// Retourne le type de tableau
function GetTableType(jQueryObject) {
    var result = "";
    if (jQueryObject.hasClass("liste")) {
        result = ESD1_MESSAGES.TableType.List;
    }
    else if (jQueryObject.hasClass("fiche")) {
        result = ESD1_MESSAGES.TableType.Details;
    }
    else if (jQueryObject.hasClass("tab2dim")) {
        result = ESD1_MESSAGES.TableType.TwoDimensions;
    }
    else if (jQueryObject.hasClass("saisie")) {
        result = ESD1_MESSAGES.TableType.Input;
    }
    else {
        result = ESD1_MESSAGES.TableType.Layout;
    }
    return result;
}

function isComplexDatatable(element) {
    var firstRowIds = [];
    var firstColIds = [];
    var i = 0;
    var j = 0;
    var isComplex = false;
    while (i < element.rows.length) {
        var row = element.rows[i];
        var j = 0;
        while (j < row.cells.length) {
            var cell = row.cells[j];
            if (
                (cell.tagName == 'TH')
                ||
                (cell.getAttribute('role') == 'columnheader')
                ||
                (cell.getAttribute('role') == 'rowheader')
            ) {
                if (i == 0) {
                    firstRowIds.push(j);
                }
                if (j == 0) {
                    firstColIds.push(i);
                }
                if ((i != 0) && (j !== 0)) {
                    isComplex = true;
                }
            }
            j = j + 1;
        }
        i = i + 1;
    }
    if (
        (firstRowIds.length > 0)
        &&
        (
            !(((firstRowIds.length == 1) && (firstRowIds[0] == 0)) || (firstRowIds.length == element.rows[0].cells.length))
            ||
            !(((firstColIds.length == 1) && (firstColIds[0] == 0)) || (firstColIds.length == element.rows.length))
        )
    ) {
        isComplex = true;
    }
    return isComplex;
}

// Vérifie si on est en norme V4
function IsMainblocfctl() {
    var result = false;
    $(".ei_mainblocfctl").each(function () {
        result = true;
    });
    return result;
}

// Vérifie si l'objet passé en paramètre est un label qui pointe vers un composant.
function TargetElement(jQueryObject, componentSelector) {
    if ((jQueryObject[0].tagName == 'LABEL') && jQueryObject[0].hasAttribute('for')) {
        let idLabel = jQueryObject[0].getAttribute("for");
        if (idLabel) {
            try {
                target = document.getElementById(idLabel);
                if (target && $(target).closest(componentSelector).length) {
                    return true;
                }
            }
            catch (e) {
                return false;
            }
        }
    };
    return false;
}

// Vérifie si l'objet passé en paramètre est un composant <e: GroupingInputBlock>
function IsGroupingInputBlock(jQueryObject) {
    return (jQueryObject.hasClass('ei_groupingblock-input') || jQueryObject.parents('div').hasClass('ei_groupingblock-input'));
}

// Vérifie si l'objet passé en paramètre est une aide à la saisie (e:Hint).
function IsAide(jQueryObject) {
    return jQueryObject.parent("div.ei_dlgbox_body").length;
}

// Vérifie si le noeud est le fils d'une liste table
function IsListTable(jQueryObject) {
    return jQueryObject.parents(".eir_tblline").length;
}

// Vérifie si l'objet passé en paramètre est l'en-tête d'une mosaïque de tuiles.
function IsRCBHeader(jQueryObject) {
    return jQueryObject.parent('div.ei_rcb_header').length;
}

// Vérifie si l'objet passé en paramètre est une pagination de liste.
function IsPager(jQueryObject) {
    return jQueryObject.parent('div.blocpaginb').length;
}

// Vérifie si l'objet passé en paramètre est un bloc CNIL (e:UserPrivacyMessage).
function IsBlocCNIL(jQueryObject) {
    return jQueryObject.siblings('a.afficher, a.masquer').length && jQueryObject.parents()[3] != undefined && jQueryObject.parents().eq(3).is('div.bloctxt.info')
}

// Vérifie si l'objet passé en paramètre est un bloc d'information responsive (a:RwdBlockExpand).
function IsBlocInfoResponsive(jQueryObject) {
    return jQueryObject.parent('div.ei_exp_head').length && jQueryObject.parents()[1] != undefined && jQueryObject.parents().eq(1).is('div.eir_exp_xs, div.eir_exp_sm');
}

// Vérifie si l'objet passé en paramètre est une bulle permanente.
function IsPermanentBubble(jQueryObject) {
    return jQueryObject.parent('div.ei_permbb_content').length;
}

// Vérifie si l'objet passé en paramètre est un lecteur PDF.
function IsPDFReader(jQueryObject) {
    return jQueryObject.parent('div.ei_pdfreader').length;
}

function IsBackButton(jQueryObject) {
    return jQueryObject.is('.ei_headerback__button');
}


function IsInputBankAccount(jQueryObject) {
    var table = jQueryObject.closest('table');
    if (table.length > 0) {
        var span = table.find("> tbody > tr > td > label > [id$='ref1Lbl']");
        if (span.length > 0) return true;
    }
    return false;
}

// Vérifie si l'objet passé en paramètre est un slider.
function IsSlider(jQueryObject) {
    //return (jQueryObject.is('div.ei_slider') || jQueryObject.parents('div.ei_slider').length);
    return (jQueryObject.closest('div.ei_slider').length);
}

// Vérifie si l'objet passé en paramètre est un titleback
function IsTitleback(jQueryObject) {
    return (jQueryObject.closest('div.ei_titleback').length);
}

// Vérifie si l'objet passé en paramètre est un titlebackblock
function IsTitlebackblock(jQueryObject) {
    return (jQueryObject.closest('div.ei_titleactionsblock').length);
}

// Vérifie si l'objet passé en paramètre est un graphique highcharts.
function IsHighCharts(jQueryObject) {
    //return (jQueryObject.is('div.ei_slider') || jQueryObject.parents('div.ei_slider').length);
    return (jQueryObject.closest('div.highcharts-container, [data-highcharts-chart]').length);
}

// Vérifie si l'objet passé en paramètre est un PFDReader.
function IsPDFReader(jQueryObject) {
    return (jQueryObject.closest('div.ei_pdfreader').length);
}


// Vérifie si l'objet passé en paramètre est une carte produit.
function IsProductCard(jQueryObject) {
    return (jQueryObject.closest('div.ei_productcard').length);
}

// Vérifie si l'objet passé en paramètre est une grille de carte .
function IsCardGrid(jQueryObject) {
    return (jQueryObject.is('ul.ei_cardgrid'));
}

// Vérifie si l'objet passé en paramètre est une FAQ.
function IsFAQ(jQueryObject) {
    return jQueryObject.is('div.ei_fnblock-vertical');
}

// Vérifie si l'objet passé en paramètre est un élément de visite guidée.
function IsDiscoveryTooltip(jQueryObject) {
    return (jQueryObject.closest('div.ei_tutotooltip').length);
}

// Vérifie si l'objet passé en paramètre est un EditableOutput.
// la classe ei_editableoutput permettra de l'identifier à partir de la v5.4
function IsEditableOutput(jQueryObject) {
    //return $("span").filter("[id$='outputZone'], [id$='inputZone']")
    //return jQueryObject.is("span").filter("[id$='outputZone'], [id$='inputZone']");
    return jQueryObject.closest("span[id$=':outputZone'], span[id$=':inputZone']").length;
}

// vérifie si l'objet est un bouton de controle du carousel
function IsControlCarousel(jQueryObject) {
    return jQueryObject.hasClass('ei_carousel__control');
}

// Vérifie si l'objet passé en paramètre est un bouton de navigation devbooster (contient une image précédent ou suivant).
function IsPrevOrNextElement(jQueryObject) {
    var Src = Esd1GetImageSrc(jQueryObject);

    if (Src == "ldetpre.gif" || Src == "ldetsui.gif") {
        return true;
    }
    return false;

}

// Vérifie si l'objet passé en paramètre est un élément de type calendrier (bloc qui s'ouvre avec un champ input date)
function IsCalendar(jQueryObject) {
    return (jQueryObject.closest('div.bloccal').length);
}

// Vérifie si l'objet passé en paramètre est un Input de type montant.
function IsInputMontant(jQueryObject) {
    return jQueryObject.closest('span:has(input.mttg)').length;
}

// Vérifie si l'objet passé en paramètre est un Input de type montant.
function IsInputRIB(jQueryObject) {
    return jQueryObject.closest("span:has(input[id$=':bank'])").length;
}

// Vérifie si l'objet passé en paramètre est un MultipleSelector.
function IsMultipleSelector(jQueryObject) {
    return jQueryObject.closest('span:has(div.eialpha_mselect)').length;
}

// Vérifie si l'objet passé en paramètre est un VerticalMenu.
function IsVerticalMenu(jQueryObject) {
    return jQueryObject.closest("ul.menu").length;
}

// Vérifie si l'objet passé en paramètre est une liste arborescente.
function IsTrTreeExpander(jQueryObject) {
    return jQueryObject.parent("tr[class$='TrExpander']").length || jQueryObject.parent().prevAll("tr[class$='TrExpander']").length;
}

// Vérifie si l'objet passé en paramètre est un AutoCompleteInput.
function IsAutoCompleteInput(jQueryObject) {
    return jQueryObject.is('div.dw_ac_list');
}

// Vérifie si l'objet passé en paramètre est un NavigationOrSubmissionImage.
function IsNavigationOrSubmissionImage(jQueryObject) {
    return jQueryObject.is("img[style^='border']");
}

// Vérifie si l'objet passé en paramètre est un VerticalTabsBlock.
function IsVerticalTabsBlock(jQueryObject) {
    return jQueryObject.closest('div.a_blocsongv').length;
}

// Vérifie si l'objet passé en paramètre est un TagLabel.
function IsTagLabel(jQueryObject) {
    return jQueryObject.closest('div.ei_lblact_root').length;
}

// Vérifie si l'objet passé en paramètre est un "Contenu à définir" dans le maquetteur.
function IsMaqContenuADefinir(jQueryObject) {
    return jQueryObject.closest('span.ei_maq_contenu_a_definir').length;
}

// Vérifie si l'objet passé en paramètre est une lightbox de session.
function IsLightBoxSession(jQueryObject) {
    return jQueryObject.closest('div#ModalLightBoxSessionExtension').length;
}

// Vérifie si l'objet passé en paramètre est un tiroir du bas.
function IsStickyDrawer(jQueryObject) {
    return jQueryObject.closest('div.ei_drawer').length;
}

// Vérifie si l'objet passé en paramètre est un tiroir vertical.
function IsSideDrawer(jQueryObject) {
    return jQueryObject.closest('div.ei_sidedrawer').length;
}

// Vérifie si l'objet passé en paramètre est strictement le panel d'un tiroir vertical.
function IsSideDrawerPanel(jQueryObject) {
    return jQueryObject.hasClass('ei_sidedrawer__panel');
}

// Vérifie si l'objet passé en paramètre est strictement le panel d'un tiroir vertical.
function IsScrollbar(jQueryObject) {
    return jQueryObject.hasClass('mCSB_container') || jQueryObject.hasClass('mCSB_scrollTools') || jQueryObject.hasClass('mCSB_dragger') || jQueryObject.hasClass('mCSB_dragger_bar');
}

// Vérifie si l'objet passé en paramètre est un TagLabel.
function IsLightBox(jQueryObject) {
    return jQueryObject.closest('div.ei_newlb.ei_blocmodal_env').length;
}

// Vérifie si l'objet passé en paramètre est une visite guidée.
function LightBoxVisiteGuidee(jQueryObject) {
    if ((jQueryObject.is('div.ei_carousel') || jQueryObject.closest('div.ei_carousel').length > 0) && jQueryObject.closest('div.ei_newlb.ei_blocmodal_env').length > 0) {
        return jQueryObject.closest('div.ei_newlb.ei_blocmodal_env');
    }
    return false;
}

// Vérifie si l'objet passé en paramètre est un carousel.
function IsCarousel(jQueryObject) {
    return jQueryObject.closest('div.ei_carousel').length;
}

// Vérifie si l'objet passé en paramètre est un composant tel:InputTel.
function IsInputPhone(jQueryObject) {
    return jQueryObject.closest('span.tel').length;
}

// Vérifie si l'objet passé en paramètre est une aide au survol.
function IsHintedInput(jQueryObject) {
    if (jQueryObject.is('div.ei_hintedinput') || jQueryObject.closest('div.ei_hintedinput').length > 0) {
        return true;
    }
    return false;
}

// Vérifie si l'objet passé en paramètre est un ImmediateUpload.
function IsImmediateUpload(jQueryObject) {
    // ca c'est le composant upload
    //return jQueryObject.closest('input.ei_upload_input').length;
    return jQueryObject.closest('span.ei_upload').length;

}

// Vérifie si l'objet passé en paramètre est un menu applicatif.
function IsApplicationMenu(jQueryObject) {
    return (jQueryObject.is('ul.a_menuappli') || jQueryObject.closest('div.ei_applicationmenu').length);
}

// Vérifie si l'objet passé en paramètre est un menu applicatif.
function IsDiscoveryToolTip(jQueryObject) {
    return jQueryObject.is('div.ei_tutorial');
}

// Vérifie si l'objet passé en paramètre est une liste de sélection restreinte.
// composant ergo v3 ?
function IsRestrictionsDropdownList(jQueryObject) {
    return jQueryObject.closest('li > span.v3').length;
}

// Vérifie si l'objet passé en paramètre est une image zoomable.
function IsImageToZoom(jQueryObject) {
    return jQueryObject.closest('div.ei_zoom_need').length;
}

// Vérifie si l'objet passé en paramètre est une liste de détails.
function IsDetailsList(jQueryObject) {
    return jQueryObject.closest('ul.dw_dl').length;
}

// Vérifie si l'objet passé en paramètre est une liste de sélection restreinte.
// composant ergo v3 ?
function IsCombobox(jQueryObject) {
    return jQueryObject.closest('.dw_cb').length;
}

function IsUserPrivacyMessage(jQueryObject) {
    return jQueryObject.closest('.UserPrivacyMessage').length;
}

// Vérifie si l'objet passé en paramètre est un richTooltip.
function IsRichTooltip(jQueryObject) {
    return (jQueryObject.hasClass('ei_hdet_box'));
}

// Vérifie si l'objet passé en paramètre est un tooltip.
function IsTooltip(jQueryObject) {
    return (jQueryObject.hasClass('blocbulle'));
}
