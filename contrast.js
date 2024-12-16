//////////////////////////////////////////////////////////////////////////////////Traitement Contrast des couleurs////////////////////////////////////////////////////////
   
    // Fonction pour récupérer les données de contraste d'un élément
    function getContrastData(element) {

        var disabled = isThisDisabled(element);
        var semiTransparency = false;
        var opacity = false;
    
        //Get background color
        var bgColor = new Color($(element).css("background-color"));
        var bgElement = getBgElement(element);
        var bgImage =			$(bgElement).css("background-image");
    
        //Get foreground color
        var fgColor = new Color($(element).css("color"));
        if(fgColor.alpha < 1){
            semiTransparency = true;
            fgColor = fgColor.overlayOn(bgColor);
        }
    
        var contrast = fgColor.contrast(bgColor);
        var ratio = contrast.ratio;
    
    console.log(fgColor+" "+ bgColor);
    
        // Si aucune couleur valide n'est trouvée, ignorer l'élément
        if (!bgColor || !fgColor) {
            console.warn("Skipping element due to missing colors.");
            return null;
        }

        const fontSize = parseFloat($(element).css("font-size"));
		const fontWeight = $(element).css("font-weight");

        var wcagLevel = {
            level: "AA",
            smallTextReqRatio: 4.5,
            largeTextReqRatio: 3
        };

		//AA Requirements (default)
		var ratio_small = wcagLevel.smallTextReqRatio;
		var ratio_large = wcagLevel.largeTextReqRatio;

        var minReq = ratio_small;

        if(fontSize >= 24)
			minReq = ratio_large;
		else if(fontSize >= 18.66 && fontWeight >= 700) //700 is where bold begins, 18.66 is approx equal to 14pt
			minReq = ratio_large;
        
        // const ratio = calculateContrastRatio(fgColor, bgColor);
        console.log("fgColor avaaant : "+fgColor); 
        var contrast = fgColor.contrast(bgColor);
        var ratio = contrast.ratio;

        return {
            bgColor,
            fgColor,
            ratio,
            minReq,
            size: fontSize,
            weight: fontWeight,
            bgImage: bgImage,
		    semiTransparency: semiTransparency,
		    opacity: opacity,
        };

        
    }

    const PageData = {
        allVisibleElements: Array.from(document.querySelectorAll("*")).filter(
            (el) => el.offsetParent !== null
        )
    };
	//This function will recursively get the element that contains the background-color or background-image.
	function getBgElement(element, disabled ,recursion){
		if(!disabled)
			disabled = isThisDisabled(element);

		if(parseInt($(element).css("opacity")) < 1)
			opacity = true;

		if($(element).css("background-image") !== "none"){
			return element;
		}
		else{
			//Store this background color
			var thisBgColor = new Color($(element).css("background-color"));

			//Overlay the accumulated bgColor with the the previous background color that was semi-transparent
			if(recursion)
				bgColor = bgColor.overlayOn(thisBgColor);
			else
				bgColor = thisBgColor;

			if($(element).is("html")){
				//transparent or semi-transparent
				if(thisBgColor.alpha < 1){
					bgColor = bgColor.overlayOn(Color.WHITE);
					if(thisBgColor.alpha > 0)
						semiTransparency = true;
				}
			}
			else if(thisBgColor.alpha < 1){
				//Look at parent element
				if(thisBgColor.alpha > 0)
					semiTransparency = true;
				return getBgElement($(element).parent(), true);
			}
			return element;
		}
	}
	function isThisDisabled(element){
		return !!($(element).prop("disabled") || $(element).attr("aria-disabled") === "true");
	}

    function isImageElement(element) {
        return ["IMG", "INPUT", "SVG", "CANVAS"].includes(element.tagName);
    }

    function hasTextExcludingChildren(element) {
        return Array.from(element.childNodes).some(
            (node) =>
                node.nodeType === Node.TEXT_NODE && node.nodeValue.trim() !== ""
        );
    }

    function hasAdditionalHidingTechniques(element) {
        const computedStyle = window.getComputedStyle(element);

        if (parseInt(computedStyle.fontSize) === 0) {
            return true;
        }

        const textIndent = parseInt(computedStyle.textIndent);
        if (textIndent !== 0 && textIndent < -998) {
            return true;
        }

        if (
            computedStyle.overflow === "hidden" &&
            (parseInt(computedStyle.height) <= 1 || parseInt(computedStyle.width) <= 1)
        ) {
            return true;
        }

        return false;
    }

// Mise à jour pour traiter les éléments avec un background transparent ou rgba(0, 0, 0, 0)
    function getEffectiveBackground(element) {
    let bgColor = window.getComputedStyle(element).backgroundColor;

    if (bgColor === "rgba(0, 0, 0, 0)" || bgColor === "transparent") {
        bgColor = getBackgroundFromParent(element);
    }

    // Si aucune couleur d'arrière-plan explicite n'a été trouvée, retourne null
    if (!bgColor) {
        console.warn("No valid background color found. Skipping this element.");
        return null;
    }

    return bgColor;
    }

    // Fonction pour gérer les arrière-plans hérités
    function getBackgroundFromParent(element) {
    let parent = element.parentElement;
    while (parent) {
        const parentStyle = window.getComputedStyle(parent);
        const bgColor = parentStyle.backgroundColor;

        // Si une couleur valide est trouvée, on la retourne
        if (bgColor && bgColor !== "rgba(0, 0, 0, 0)" && bgColor !== "transparent") {
            return bgColor;
        }

        // Si un arrière-plan image est détecté, traiter comme une exception et continuer la recherche
        if (parentStyle.backgroundImage && parentStyle.backgroundImage !== "none") {
            console.warn(`Background image detected on parent: ${parentStyle.backgroundImage}. Skipping this parent.`);
        }

        parent = parent.parentElement;
    }

    // Retourner null pour indiquer qu'aucune couleur d'arrière-plan explicite n'a été trouvée
    return null;
    }

    // Calcule le ratio de contraste
    function calculateContrastRatio(fgColor, bgColor) {
        const fgLuminance = calculateLuminance(fgColor);
        const bgLuminance = calculateLuminance(bgColor);

        return (
            (Math.max(fgLuminance, bgLuminance) + 0.05) /
            (Math.min(fgLuminance, bgLuminance) + 0.05)
        ).toFixed(2);
    }

    // Calcule la luminance pour une couleur donnée
    function calculateLuminance(color) {
        const rgb = color
            .match(/\d+/g)
            .map((value) => parseInt(value, 10) / 255)
            .map((channel) =>
                channel <= 0.03928
                    ? channel / 12.92
                    : Math.pow((channel + 0.055) / 1.055, 2.4)
            );

        return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
    }

    function rgbToHex(rgb) {
        // Extraire les valeurs de R, G, et B de la chaîne RGB
        const rgbValues = rgb.match(/\d+/g);
    
        // Convertir chaque valeur RGB en hexadécimal, ajouter un zéro si nécessaire pour que chaque composant ait deux chiffres
        const hex = rgbValues
            .map(val => {
                const hexVal = parseInt(val).toString(16); // Conversion en hex
                return hexVal.length == 1 ? "0" + hexVal : hexVal; // Ajouter un zéro si nécessaire
            })
            .join(''); // Joindre les valeurs hexadécimales
    
        // Ajouter le caractère '#' au début pour obtenir un format hexadécimal
        return `#${hex}`;
    }

// Extend Math.round to allow for precision
Math.round = (function(){
	var round = Math.round;
	return function (number, decimals){
		decimals = +decimals || 0;
		var multiplier = Math.pow(10, decimals);
		return round(number * multiplier) / multiplier;
	};
})();

// Simple class for handling sRGB colors
(function(){

var _ = self.Color = function(rgba){
	if(rgba === 'transparent'){
		rgba = [0,0,0,0];
	}
	else if(typeof rgba === 'string'){
		var rgbaString = rgba;
		rgba = rgbaString.match(/rgba?\(([\d.]+), ([\d.]+), ([\d.]+)(?:, ([\d.]+))?\)/);

		if(rgba){
			rgba.shift();
		}
		else {
			throw new Error('Invalid string: ' + rgbaString);
		}
	}

	if(rgba[3] === undefined){
		rgba[3] = 1;
	}

	rgba = rgba.map(function (a){ return Math.round(a, 3); });

	this.rgba = rgba;
};

_.prototype = {
	get rgb (){
		return this.rgba.slice(0,3);
	},

	get alpha (){
		return this.rgba[3];
	},

	set alpha (alpha){
		this.rgba[3] = alpha;
	},

	get luminance (){
		var rgba = this.rgba.slice();

		for(var i=0; i<3; i++){
			var rgb = rgba[i];

			rgb /= 255;

			rgb = rgb < 0.03928 ? rgb / 12.92 : Math.pow((rgb + 0.055) / 1.055, 2.4);

			rgba[i] = rgb;
		}

		return 0.2126 * rgba[0] + 0.7152 * rgba[1] + 0.0722 * rgba[2];
	},

	get inverse (){
		return new _([
			255 - this.rgba[0],
			255 - this.rgba[1],
			255 - this.rgba[2],
			this.alpha
		]);
	},

	toString: function(){
		return 'rgb' + (this.alpha < 1? 'a' : '') + '(' + this.rgba.slice(0, this.alpha >= 1? 3 : 4).join(', ') + ')';
	},

	clone: function(){
		return new _(this.rgba);
	},

	//Overlay a color over another
	overlayOn: function (color){
		var overlaid = this.clone();

		var alpha = this.alpha;

		if(alpha >= 1){
			return overlaid;
		}

		//Modified code (Mod 1): (moved this line before the for loop)
		overlaid.rgba[3] = alpha + (color.rgba[3] * (1 - alpha));

		for(var i=0; i<3; i++){
			//Modified code (Mod 2): (divide by the overlaid alpha if not zero) (Formula: https://en.wikipedia.org/wiki/Alpha_compositing#Alpha_blending)
			if(overlaid.rgba[3] !== 0)
				overlaid.rgba[i] = (overlaid.rgba[i] * alpha + color.rgba[i] * color.rgba[3] * (1 - alpha)) / overlaid.rgba[3];
			else
			//Modified code (Mod 2) End
				overlaid.rgba[i] = overlaid.rgba[i] * alpha + color.rgba[i] * color.rgba[3] * (1 - alpha);
		}

		//Original code (Mod 1):
		//overlaid.rgba[3] = alpha + (color.rgba[3] * (1 - alpha));

		return overlaid;
	},

	contrast: function (color){
		// Formula: http://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef
		var alpha = this.alpha;

		if(alpha >= 1){
			if(color.alpha < 1){
				color = color.overlayOn(this);
			}

			var l1 = this.luminance + 0.05,
				l2 = color.luminance + 0.05,
				ratio = l1/l2;
                console.log("luminance           !!!!!!!!"+this.luminance+"teeeest"+color.luminance);
			if(l2 > l1){
				ratio = 1 / ratio;
			}

			//Original Code (Mod 3):
			//ratio = Math.round(ratio, 1);
			//Modified code (Mod 3): increased the contrast rounding precision to two decimals
			ratio = Math.round(ratio, 2);

			return {
				ratio: ratio,
				error: 0,
				min: ratio,
				max: ratio
			};
		}

		// If we’re here, it means we have a semi-transparent background
		// The text color may or may not be semi-transparent, but that doesn't matter

		var onBlack = this.overlayOn(_.BLACK),
		    onWhite = this.overlayOn(_.WHITE),
		    contrastOnBlack = onBlack.contrast(color).ratio,
		    contrastOnWhite = onWhite.contrast(color).ratio;

		var max = Math.max(contrastOnBlack, contrastOnWhite);

		// This is here for backwards compatibility and not used to calculate
		// `min`.  Note that there may be other colors with a closer luminance to
		// `color` if they have a different hue than `this`.
		var closest = this.rgb.map(function(c, i){
			return Math.min(Math.max(0, (color.rgb[i] - c * alpha)/(1-alpha)), 255);
		});

		closest = new _(closest);

		var min = 1;
		if(onBlack.luminance > color.luminance){
			min = contrastOnBlack;
		}
		else if(onWhite.luminance < color.luminance){
			min = contrastOnWhite;
		}

		return {
			ratio: Math.round((min + max) / 2, 2),
			error: Math.round((max - min) / 2, 2),
			min: min,
			max: max,
			closest: closest,
			farthest: onWhite == max? _.WHITE : _.BLACK
		};
	}
};

_.BLACK = new _([0,0,0]);
_.GRAY = new _([127.5, 127.5, 127.5]);
_.WHITE = new _([255,255,255]);

})();
//color.js End
//===============




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



