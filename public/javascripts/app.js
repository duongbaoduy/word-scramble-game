$.get("/ajax", function(data) {
    $("#info").append(data);
});

var specialKeys = new Array();
specialKeys.push(8); //Backspace
specialKeys.push(9); //Tab
specialKeys.push(46); //Delete
specialKeys.push(36); //Home
specialKeys.push(35); //End
specialKeys.push(37); //Left
specialKeys.push(39); //Right
specialKeys.push(13); //Enter
function IsAlphaNumeric(e) {
    var charCode = (e.which) ? e.which : e.keyCode;
    var ret = ((charCode >= 48 && charCode <= 57)
            || (charCode >= 65 && charCode <= 90)
            || (charCode >= 97 && charCode <= 122)
            || (specialKeys.indexOf(e.keyCode) != -1 && e.charCode != e.keyCode));
//    document.getElementById("error").style.display = ret ? "none" : "inline";
    return ret;
}

function isCapslock(e) {

    e = (e) ? e : window.event;

    var charCode = false;
    if (e.which) {
        charCode = e.which;
    } else if (e.keyCode) {
        charCode = e.keyCode;
    }

    var shifton = false;
    if (e.shiftKey) {
        shifton = e.shiftKey;
    } else if (e.modifiers) {
        shifton = !!(e.modifiers & 4);
    }

    if (charCode >= 97 && charCode <= 122 && shifton) {
        return true;
    }

    if (charCode >= 65 && charCode <= 90 && !shifton) {
        return true;
    }

    return false;

}


var Game = (function() {
    function Game(suggest) {
        this.suggest_letter = suggest;
        this.input_area = "#input";
        this.result_area = "#result";
        this.matched_list_area = "#matched_list";
        this.suggest_area = "#suggest";
        this.matched_word_list = [];
    }

    Game.prototype.setSuggest = function(suggest) {
        this.suggest_letter = suggest;
        $(this.suggest_area).text(this.suggest_letter);
    };

    Game.prototype.getSuggest = function() {
        return this.suggest_letter;
    };

    Game.prototype.appendInput = function(e) {
        e.preventDefault();
//     e = e || window.event;
        console.log(e);
        if (IsAlphaNumeric(e)) {
            var character_press = String.fromCharCode(e.which);
            var index = this.suggest_letter.indexOf(character_press);
            if (index >= 0) {
                this.suggest_letter = this.suggest_letter.substring(0, index) + this.suggest_letter.substring(index + 1, this.suggest_letter.length);
                $(this.input_area).append(character_press);
            }
        }
        var key = (e.which) ? e.which : e.keyCode;
        if (key == 8 || key == 46) {
            word = $(this.input_area).text() || "";
            this.setSuggest(this.getSuggest() + word.substring(word.length - 1, word.length));
            $(this.input_area).text(function(_, txt) {
                return txt.slice(0, -1);
            });
            return false;
        }
        if (key == 13) {
            //submit code to server
            this.check();
        }
    };
    Game.prototype.check = function() {
        var service_url = "/check"; // call api url service
        var method = "POST";
        $.ajax({
            url: service_url + "?p=" + $(this.input_area).text(),
            type: method,
            context: this,
            sync: true,
            cache: false,
            datatype: 'json',
            success: function(data, textStatus, jqXHR) {
                var res = JSON.parse(data);
                console.log(res.check);
                if (res.check) {
                    this.addMatched($(this.input_area).text() + "");
                    this.setSuggest(this.getSuggest() + $(this.input_area).text());
                    $(this.input_area).html("");
                    console.log($(this.input_area).text());
                } else {
                    console.log(this.result_area + "   try failed.");
                    $(this.result_area).html("try failed.");
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                $(this.result_area).text("try to connect server failed.");
            }
        });
    };
    Game.prototype.addMatched = function(matched_string) {
        this.matched_word_list = this.matched_word_list || [];
        this.matched_word_list.push(matched_string);
        var i, l, list, li;
        items = this.matched_word_list;
        if (!items || !items.length) {
            return;
        } // return here if there are no items to render
        $(this.matched_list_area).text("");
        list = $("<ul></ul>").appendTo(this.matched_list_area); // create a list element within the parent element
        for (i = 0, l = items.length; i < l; i++) {
            li = $("<li></li>").text(items[i]);  // make a list item element
            list.append(li);
        }
    };
    return Game;
})();

var chars = {32: ' ', 33: '!', 34: '"', 35: '#', 36: '$', 37: '%', 38: '&', 39: '\'', 40: '(', 41: ')', 42: '*', 43: '+', 44: ',', 45: '-', 46: '.', 47: '/', 48: '0', 49: '1', 50: '2', 51: '3', 52: '4', 53: '5', 54: '6', 55: '7', 56: '8', 57: '9', 58: ':', 59: ';', 60: '<', 61: '=', 62: '>', 63: '?', 64: '@', 65: 'A', 66: 'B', 67: 'C', 68: 'D', 69: 'E', 70: 'F', 71: 'G', 72: 'H', 73: 'I', 74: 'J', 75: 'K', 76: 'L', 77: 'M', 78: 'N', 79: 'O', 80: 'P', 81: 'Q', 82: 'R', 83: 'S', 84: 'T', 85: 'U', 86: 'V', 87: 'W', 88: 'X', 89: 'Y', 90: 'Z', 91: '[', 92: '\\', 93: ']', 94: '^', 95: '_', 96: '`', 97: 'a', 98: 'b', 99: 'c', 100: 'd', 101: 'e', 102: 'f', 103: 'g', 104: 'h', 105: 'i', 106: 'j', 107: 'k', 108: 'l', 109: 'm', 110: 'n', 111: 'o', 112: 'p', 113: 'q', 114: 'r', 115: 's', 116: 't', 117: 'u', 118: 'v', 119: 'w', 120: 'x', 121: 'y', 122: 'z', 123: '{', 124: '|', 125: '}', 126: '~', 127: '', 128: '', 129: '', 130: '', 131: '', 132: '', 133: '', 134: '', 135: '', 136: '', 137: '', 138: '', 139: '', 140: '', 141: '', 142: '', 143: '', 144: '', 145: '', 146: '', 147: '', 148: '', 149: '', 150: '', 151: '', 152: '', 153: '', 154: '', 155: '', 156: '', 157: '', 158: '', 159: '', 160: ' ', 161: '¡', 162: '¢', 163: '£', 164: '¤', 165: '¥', 166: '¦', 167: '§', 168: '¨', 169: '©', 170: 'ª', 171: '«', 172: '¬', 173: '­', 174: '®', 175: '¯', 176: '°', 177: '±', 178: '²', 179: '³', 180: '´', 181: 'µ', 182: '¶', 183: '·', 184: '¸', 185: '¹', 186: 'º', 187: '»', 188: '¼', 189: '½', 190: '¾', 191: '¿', 192: 'À', 193: 'Á', 194: 'Â', 195: 'Ã', 196: 'Ä', 197: 'Å', 198: 'Æ', 199: 'Ç', 200: 'È', 201: 'É', 202: 'Ê', 203: 'Ë', 204: 'Ì', 205: 'Í', 206: 'Î', 207: 'Ï', 208: 'Ð', 209: 'Ñ', 210: 'Ò', 211: 'Ó', 212: 'Ô', 213: 'Õ', 214: 'Ö', 215: '×', 216: 'Ø', 217: 'Ù', 218: 'Ú', 219: 'Û', 220: 'Ü', 221: 'Ý', 222: 'Þ', 223: 'ß', 224: 'à', 225: 'á', 226: 'â', 227: 'ã', 228: 'ä', 229: 'å', 230: 'æ', 231: 'ç', 232: 'è', 233: 'é', 234: 'ê', 235: 'ë', 236: 'ì', 237: 'í', 238: 'î', 239: 'ï', 240: 'ð', 241: 'ñ', 242: 'ò', 243: 'ó', 244: 'ô', 245: 'õ', 246: 'ö', 247: '÷', 248: 'ø', 249: 'ù', 250: 'ú', 251: 'û', 252: 'ü', 253: 'ý', 254: 'þ', 255: 'ÿ', 256: 'Ā', 257: 'ā', 258: 'Ă', 259: 'ă', 260: 'Ą', 261: 'ą', 262: 'Ć', 263: 'ć', 264: 'Ĉ', 265: 'ĉ', 266: 'Ċ', 267: 'ċ', 268: 'Č', 269: 'č', 270: 'Ď', 271: 'ď', 272: 'Đ', 273: 'đ', 274: 'Ē', 275: 'ē', 276: 'Ĕ', 277: 'ĕ', 278: 'Ė', 279: 'ė', 280: 'Ę', 281: 'ę', 282: 'Ě', 283: 'ě', 284: 'Ĝ', 285: 'ĝ', 286: 'Ğ', 287: 'ğ', 288: 'Ġ', 289: 'ġ', 290: 'Ģ', 291: 'ģ', 292: 'Ĥ', 293: 'ĥ', 294: 'Ħ', 295: 'ħ', 296: 'Ĩ', 297: 'ĩ', 298: 'Ī', 299: 'ī', 300: 'Ĭ', 301: 'ĭ', 302: 'Į', 303: 'į', 304: 'İ', 305: 'ı', 306: 'Ĳ', 307: 'ĳ', 308: 'Ĵ', 309: 'ĵ', 310: 'Ķ', 311: 'ķ', 312: 'ĸ', 313: 'Ĺ', 314: 'ĺ', 315: 'Ļ', 316: 'ļ', 317: 'Ľ', 318: 'ľ', 319: 'Ŀ', 320: 'ŀ', 321: 'Ł', 322: 'ł', 323: 'Ń', 324: 'ń', 325: 'Ņ', 326: 'ņ', 327: 'Ň', 328: 'ň', 329: 'ŉ', 330: 'Ŋ', 331: 'ŋ', 332: 'Ō', 333: 'ō', 334: 'Ŏ', 335: 'ŏ', 336: 'Ő', 337: 'ő', 338: 'Œ', 339: 'œ', 340: 'Ŕ', 341: 'ŕ', 342: 'Ŗ', 343: 'ŗ', 344: 'Ř', 345: 'ř', 346: 'Ś', 347: 'ś', 348: 'Ŝ', 349: 'ŝ', 350: 'Ş', 351: 'ş', 352: 'Š', 353: 'š', 354: 'Ţ', 355: 'ţ', 356: 'Ť', 357: 'ť', 358: 'Ŧ', 359: 'ŧ', 360: 'Ũ', 361: 'ũ', 362: 'Ū', 363: 'ū', 364: 'Ŭ', 365: 'ŭ', 366: 'Ů', 367: 'ů', 368: 'Ű', 369: 'ű', 370: 'Ų', 371: 'ų', 372: 'Ŵ', 373: 'ŵ', 374: 'Ŷ', 375: 'ŷ', 376: 'Ÿ', 377: 'Ź', 378: 'ź', 379: 'Ż', 380: 'ż', 381: 'Ž', 382: 'ž', 383: 'ſ', 384: 'ƀ', 385: 'Ɓ', 386: 'Ƃ', 387: 'ƃ', 388: 'Ƅ', 389: 'ƅ', 390: 'Ɔ', 391: 'Ƈ', 392: 'ƈ', 393: 'Ɖ', 394: 'Ɗ', 395: 'Ƌ', 396: 'ƌ', 397: 'ƍ', 398: 'Ǝ', 399: 'Ə', 400: 'Ɛ', 401: 'Ƒ', 402: 'ƒ', 403: 'Ɠ', 404: 'Ɣ', 405: 'ƕ', 406: 'Ɩ', 407: 'Ɨ', 408: 'Ƙ', 409: 'ƙ', 410: 'ƚ', 411: 'ƛ', 412: 'Ɯ', 413: 'Ɲ', 414: 'ƞ', 415: 'Ɵ', 416: 'Ơ', 417: 'ơ', 418: 'Ƣ', 419: 'ƣ', 420: 'Ƥ', 421: 'ƥ', 422: 'Ʀ', 423: 'Ƨ', 424: 'ƨ', 425: 'Ʃ', 426: 'ƪ', 427: 'ƫ', 428: 'Ƭ', 429: 'ƭ', 430: 'Ʈ', 431: 'Ư', 432: 'ư', 433: 'Ʊ', 434: 'Ʋ', 435: 'Ƴ', 436: 'ƴ', 437: 'Ƶ', 438: 'ƶ', 439: 'Ʒ', 440: 'Ƹ', 441: 'ƹ', 442: 'ƺ', 443: 'ƻ', 444: 'Ƽ', 445: 'ƽ', 446: 'ƾ', 447: 'ƿ', 448: 'ǀ', 449: 'ǁ', 450: 'ǂ', 451: 'ǃ', 452: 'Ǆ', 453: 'ǅ', 454: 'ǆ', 455: 'Ǉ', 456: 'ǈ', 457: 'ǉ', 458: 'Ǌ', 459: 'ǋ', 460: 'ǌ', 461: 'Ǎ', 462: 'ǎ', 463: 'Ǐ', 464: 'ǐ', 465: 'Ǒ', 466: 'ǒ', 467: 'Ǔ', 468: 'ǔ', 469: 'Ǖ', 470: 'ǖ', 471: 'Ǘ', 472: 'ǘ', 473: 'Ǚ', 474: 'ǚ', 475: 'Ǜ', 476: 'ǜ', 477: 'ǝ', 478: 'Ǟ', 479: 'ǟ', 480: 'Ǡ', 481: 'ǡ', 482: 'Ǣ', 483: 'ǣ', 484: 'Ǥ', 485: 'ǥ', 486: 'Ǧ', 487: 'ǧ', 488: 'Ǩ', 489: 'ǩ', 490: 'Ǫ', 491: 'ǫ', 492: 'Ǭ', 493: 'ǭ', 494: 'Ǯ', 495: 'ǯ', 496: 'ǰ', 497: 'Ǳ', 498: 'ǲ', 499: 'ǳ', 500: 'Ǵ', 501: 'ǵ', 502: 'Ƕ', 503: 'Ƿ', 504: 'Ǹ', 505: 'ǹ', 506: 'Ǻ', 507: 'ǻ', 508: 'Ǽ', 509: 'ǽ', 510: 'Ǿ', 511: 'ǿ', 711: 'ˇ', 728: '˘', 729: '˙', 731: '˛', 733: '˝', 913: 'Α', 914: 'Β', 915: 'Γ', 916: 'Δ', 917: 'Ε', 918: 'Ζ', 919: 'Η', 920: 'Θ', 921: 'Ι', 922: 'Κ', 923: 'Λ', 924: 'Μ', 925: 'Ν', 926: 'Ξ', 927: 'Ο', 928: 'Π', 929: 'Ρ', 931: 'Σ', 932: 'Τ', 933: 'Υ', 934: 'Φ', 935: 'Χ', 936: 'Ψ', 937: 'Ω', 945: 'α', 946: 'β', 947: 'γ', 948: 'δ', 949: 'ε', 950: 'ζ', 951: 'η', 952: 'θ', 953: 'ι', 954: 'κ', 955: 'λ', 956: 'μ', 957: 'ν', 958: 'ξ', 959: 'ο', 960: 'π', 961: 'ρ', 962: 'ς', 963: 'σ', 964: 'τ', 965: 'υ', 966: 'φ', 967: 'χ', 968: 'ψ', 969: 'ω', 977: 'ϑ', 978: 'ϒ', 982: 'ϖ', 8211: '–', 8212: '—', 8216: '‘', 8217: '’', 8218: '‚', 8220: '“', 8221: '”', 8222: '„', 8224: '†', 8225: '‡', 8226: '•', 8230: '…', 8240: '‰', 8242: '′', 8249: '‹', 8250: '›', 8254: '‾', 8260: '⁄', 8364: '€', 8465: 'ℑ', 8472: '℘', 8476: 'ℜ', 8482: '™', 8501: 'ℵ', 8592: '←', 8593: '↑', 8594: '→', 8595: '↓', 8596: '↔', 8629: '↵', 8656: '⇐', 8657: '⇑', 8658: '⇒', 8659: '⇓', 8660: '⇔', 8704: '∀', 8706: '∂', 8707: '∃', 8709: '∅', 8711: '∇', 8712: '∈', 8713: '∉', 8715: '∋', 8719: '∏', 8721: '∑', 8722: '−', 8727: '∗', 8730: '√', 8733: '∝', 8734: '∞', 8736: '∠', 8743: '∧', 8744: '∨', 8745: '∩', 8746: '∪', 8747: '∫', 8756: '∴', 8764: '∼', 8773: '≅', 8776: '≈', 8800: '≠', 8801: '≡', 8804: '≤', 8805: '≥', 8834: '⊂', 8835: '⊃', 8836: '⊄', 8838: '⊆', 8839: '⊇', 8853: '⊕', 8855: '⊗', 8869: '⊥', 8901: '⋅', 8968: '⌈', 8969: '⌉', 8970: '⌊', 8971: '⌋', 9001: '〈', 9002: '〉', 9674: '◊', 9824: '♠', 9827: '♣', 9829: '♥', 9830: '♦'};

$(document).ready(function() {
    $.ajax({
        url: "/suggest",
        type: "GET",
        success: function(data, textStatus, jqXHR) {
            console.log(data);
            var _game = new Game(data);
            $(_game.suggest_area).text(data);
            $(window).on("keydown", function(e) {
                _game.appendInput(e);
                $(_game.suggest_area).text(_game.suggest_letter);
            });
        },
        error: function(jqXHR, textStatus, errorThrown) {

        }
    });
});