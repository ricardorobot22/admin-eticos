import $ from 'jquery';

let token = {

    token: '123',

};

const API_URL = "https://www.droguerialaeconomia.com/";

//const API_URL = "http://localhost:3001/";

const _fetch = async (url, params) => {

    if (!params) params = {};

    let request = {
        method: 'POST',
        headers: new Headers({
            "Content-Type": "application/json",  // Cambiado a JSON
            "Accept": "application/json"
        }),
        body: JSON.stringify(params),  // Enviar el cuerpo en formato JSON
    };

    let data = await fetch(`${API_URL}${url}`, request);
    data = await data.json();
    return data;
};




const encode = (obj, parent = "", keyparent = "") => 

{

    

    let r = "", isObject;

    

    IMP.forEach(obj, (item, key) => {

        isObject = typeof item == "object"

        if(item == null || item == undefined || (isObject && Object.keys(item).length == 0)) return;



        if(parent == "") {

            if(!isObject) r += encodeURIComponent(key)

        } else r += encodeURIComponent(keyparent) + `[${encodeURIComponent(key)}]`



        if(isObject) {

            r += encode(item, key, parent == "" ? key : "")

        } else r += `=${encodeURIComponent(item)}&`



    })



    return r;

}



const encode2 = (params) => 

{

    let urlEncoded = '';




    for (const key in params) {

        if (params.hasOwnProperty(key)) {

            if(typeof params[key] == "object") {

                for (const childkey in params[key]) {

                    if (params[key].hasOwnProperty(childkey)) {

                        if(typeof params[key][childkey] == "object") {

                            for (const childkey2 in params[key][childkey]) {

                                urlEncoded += key + '[' + childkey + ']' + '[' + childkey2 + ']' + '=' + params[key][childkey][childkey2] + '&';

                            }

                        } else {

                            if(key != "") urlEncoded += key + '[' + childkey + ']' + '=' + params[key][childkey] + '&'; 

                        } 

                    }

                }

            } else {

                if(key != "") urlEncoded += key + '=' + params[key] + '&';

            }     

        }

    }

    

    return urlEncoded.substr(0, urlEncoded.length - 1);

}



 var IMP = (function() {



    let store = {},

        comps = {}

    ;



    const model = (data, index, keys, path = "") => {



        let key,

            nextKey,

            result = {data, key: keys[index], path}

        ;



        if (index < keys.length - 1) {

            key = keys[index]

            nextKey = keys[index + 1]

            if(data[key] == undefined) {

                if(!isNaN(key)) key = parseInt(key)

                if(nextKey != undefined) data[key] = !isNaN(nextKey) ? [] : {}

            }

            result = model(data[key], index + 1, keys, path + key + ".")

        }



        return result

    }





   const  setValue = (model, send, mode) => {

        if(send.type == "Object" && mode == "merge") {

            if(model.data[model.key] == undefined) model.data[model.key] = send.value

            else model.data[model.key] = Object.assign(model.data[model.key], send.value)

        } else model.data[model.key] = send.value

    }



   const callbacks = (components, model, send, mode) => {

        

        if(!components) return false



        let response = false;

        

        IMP.forEach(components, component =>

        {

            

            if(typeof component.modelBeforeSet == "function") component.modelBeforeSet(send)



            if(send.value != undefined) setValue(model, send, mode);

            if(model && model.data) send.row = model.data[model.key]



            response = true;

            

            if(typeof component.onSet == "function") {

                let path = send.path.replace(model.path, "")

                if(path == "data") return

                component.onSet({

                    component,

                    row: send.row,

                    value: send.value,

                    path,

                    type: Object.prototype.toString.call(send.value).replace("[object ", "").replace("]", "") //Object.prototype.toString.call(value).match(/\s(.*?)\]/g)

                }, send.row);

            }

        });



        return response;

    }



    return {



        forEach: (data, callback) => {

            if (!data) return false

            

            let type = Object.prototype.toString.call(data);

    

            if(type == "[object Object]") Object.keys(data).forEach((key, index) => callback(data[key], key, index, true));

            else {

                if(type != "[object Array]") data = [data];

                data.forEach(callback);

            }



            return true

        },



        get: (path, data = store) => {



            if(path == undefined || path == "") return

            let keys = path.toString().split(".");

            if(keys.length == 0) return store[path]

            else {

                let m = model(data, 0, keys)

                return m.data[m.key]

            }

        },



        set: (path, value, mode) => {

            

            if(path == undefined || path == "") return

            let keys = path.toString().split("."),

                m,

                send = {

                    mode,

                    path,

                    value,

                    type: Object.prototype.toString.call(value).replace("[object ", "").replace("]", "")

                }

            ;



            if(keys.length == 0) m = {data:store, key:path}

            else m = model(store, 0, keys)



            // set callbacks

            if(!callbacks(comps[m.path.substring(0, m.path.length - 1)], m, send, mode)) setValue(m, send, mode)



        },



        watch: (path, component, value) => {

            

            if(path == undefined || path == "") return



            let keys = path.toString().split("."),

                m,

                send = {

                    path,

                    value,

                    type: Object.prototype.toString.call(value).replace("[object ", "").replace("]", "")

                }

            ;

            

            // add component

            if(!comps[path]) comps[path] = [];

            comps[path].push(component)



            // get model data to set any value to component

            if(keys.length == 0) m = {data:store, key:path}

            else m = model(store, 0, keys)



            callbacks([component], m, send);

        },



        get_form: ($target, scheme, exclution = []) => {

            

            if(!scheme) return;



            let data = Object.assign({}, scheme)

            Object.keys(data).forEach(key => {

                if(exclution.includes(key)) {

                    delete data[key]

                    return;

                }

                if(!$target) return data[key] = "";

                let $elem = $target.find(`[data-field="${key}"]`),

                    $e

                ;

                if($elem.length == 0) return;



                $elem.each((index, elem) => {

                    switch(elem.tagName) {

                        case "INPUT":

                        case "SELECT":

                        case "TEXTAREA": 

                            data[key] = elem.value;

                            break;

                        case "DIV":

                            //data[key] = getAction($(elem))

                    }

                })

            })

            return data

        },



        set_form: ($target, data, exclution = []) => {

            

            if(!data) return;



            Object.keys(data).forEach(key => {

                

                if(exclution.includes(key)) return;

                if(data[key] == null || data[key] == "null" ) data[key] = "";



                let $elem = $target.find(`[data-field="${key}"]`),

                    $e

                ;

    

                if($elem.length == 0) return;

    

                $elem.each((index, elem) => {

                    

                    let value

                    try {

                        value = data[key]

                    } catch(e) {value = data[key]}



                    switch(elem.tagName) {

                        case "INPUT": elem.value = value; break;

                        case "TEXTAREA": elem.value = value; break;

                        case "SELECT": elem.value = value; break;

                        case "SPAN": elem.innerHTML = value; break;

                        case "DIV":

                            //setAction($(elem), value)



                    }

                })

            })

    

        },



        arrayAsObject: (data, pk) => {

            let result = {}

            IMP.forEach(data, item => result["IMP" + item[pk]] = item)

            return result

        },



        crud: async (dataset, sendData, mode = "get") => {



            dataset.onEvent("sending", sendData, mode)

        

            let result = await _fetch(mode == "get" ? dataset.endpoint : dataset.set_endpoint, sendData)

            if(result.error) {

                if(dataset.debugMode) console.log(result)

                dataset.onEvent("error", result)

                return false

            }  

            return result

        },



        renderText: (str, data) => {



            var obj = {}, splites,matches,r;

            

            if(!str) return



            if ((matches = str.match(/{{(.+?)}}/g))) 

            {

                matches.forEach((key, index) =>

                {

                    key = key.replace(/[{}]/g, "");

                    if ((splites = key.split(".")).length === 1) return obj[key] = data[key];

                    else {

                        obj[key] = data[splites.shift()];

                        splites.forEach(match => {if(obj[key]) obj[key] = obj[key][match]})

                    }

                });

            }

        

            return str.replace(/{{(.+?)}}/g, 

                matched => (r = obj[matched.replace(/[{}]/g, "").replace(/\[(.*?)\]/g, "")]) == undefined ? "" : r);

        

        },



        renderListRow: function ($targets, row, $template, id) {

            if(!Array.isArray($targets)) $targets = [$targets]

            IMP.forEach($targets, $target => {

                let $elem = $target.children(`[data-id="${id}"]`);

                if($elem.length > 0) $elem[0].outerHTML = IMP.renderText($template.html(), row)

                else $target.append(IMP.renderText($template.html(), row))

            })

        },



        merge: function(obj1, obj2) {

            return Object.assign({}, obj1, obj2)

        },



        sortByField: function(data, field) {

            return data.sort((a,b) => (a[field] > b[field]) ? 1 : ((b[field] > a[field]) ? -1 : 0));

        },



        arrayfy: function(object) {

            let r = []

            IMP.forEach(object, item => r.push(item))

            return r

        },



    }



}());





 function DATASET(options = {}) {

    

    this.name = options.name || "dataset";

    this.api_model = options.api_model || "";

    this.endpoint = options.endpoint || "crud";
    this.set_endpoint = options.set_endpoint || "crud";

    this.currentPK = null;

    this.pk = options.pk || "id";

    this.noset = options.noset || [];

    this.noget = options.noget || [];

    this.noreset = options.noreset || [];

    this.scheme = options.scheme || {};

    this.model = options.affect || false;

    this.onEvent = options.onEvent || (() => {});

    this.sort = options.sort || {};

    this.pagecount = options.pagecount || 100;

    this.paging = options.paging || {page: 0, count: this.pagecount};

    this.debugMode = true;


}



DATASET.prototype.setCurrentPK = function(value = null) {

    if(this.currentPK) IMP.set(`${this.model}.data.IMP${this.currentPK}`, {IMPactive: false}, "merge");

    if((this.currentPK = value)) IMP.set(`${this.model}.data.IMP${value}`, {IMPactive: true}, "merge");

}



DATASET.prototype.getCurrentItem = function() {

    if(this.currentPK) return Object.assign({}, IMP.get(`${this.model}.data.IMP${this.currentPK}`))

    else return {}

}





DATASET.prototype.localFilter = function(filter = item => true) {

    IMP.forEach(IMP.get(`${this.model}.data`), (item, key, index) => {

        IMP.set(`${this.model}.data.IMP${item[this.pk]}`, {IMPfilter: filter(item, key), IMPindex: index}, "merge")

    })

}



DATASET.prototype.setLocal = async function(data, mode = "set") {

    

    let sendRow, _this = this;

    if(mode == "set") IMP.set(`${this.model}.data`, {})

    IMP.forEach(data, (item, key, index, isObject) => {

        this.onEvent(_this, "rowdata", (sendRow = Object.assign({}, item)));

        Object.keys(sendRow).forEach(key => {

            try {

                sendRow[key] = decodeURI(sendRow[key])

            } catch(e) {}

        })

        if(isObject) IMP.set(`${this.model}.data.IMP${key}`, sendRow, mode)

        else IMP.set(`${this.model}.data.IMP${sendRow[this.pk]}`, sendRow, mode)

    })

    this.onEvent(this, "data", IMP.get(`${this.model}.data`));

}



DATASET.prototype.get = async function(sendData = {}) {

    sendData = {

        "default": {
            mode: "get",
            table: this.api_model,
            fields: sendData.fields || IMP.get_form(null, this.scheme, this.noget),
            filter: sendData.filter || (this.currentPK ? {id: this.currentPK} : null),
            sort: sendData.sort || this.sort,
            paging: sendData.paging || this.paging
        }
    }

    this.onEvent(this, "fetching", sendData, "get")

    let result = await IMP.crud(this, sendData, "get")

    if(!result.error) {

        this.setLocal(result.default)
        this.onEvent(this, "success", result, "get");
        return result
    }

    return {}
}



DATASET.prototype.set = async function(sendData) {



    if(!IMP.forEach(sendData, item => Object.assign(item, {mode: "set", "table": this.api_model}))) return;



    this.onEvent(this, "fetching", sendData, "set")

    

    let data = {}, hasError = false, result = await IMP.crud(this, sendData, "set");

    //console.log(result)

    if(result.error) return;

    

    IMP.forEach(result, (item, key) => {

        if(item.error) hasError = true

        else {

            if(item.insertId > 0) {

                data[item.insertId] = sendData[key].fields

                data[item.insertId][this.pk] = item.insertId

            } else if(item.affectedRows > 0) {

                data[key] = sendData[key].fields

            } else data[key] = sendData[key].fields

        }

    })

    if(!hasError) this.setLocal(data, "merge")

    this.onEvent(this, hasError ? "error" : "success", result, "set");

    return result

}



async function getLogin(user, password) {

    const result = await _fetch("login", {

        user,

        password

    })

    if(result.default.length > 0) return result.default[0]

    return false

}



const message = ($actionBar, type, text) => {



    $actionBar.append(`

        <div class="message ${type}">${text}</div>

    `)



    $actionBar.find(".message").show(300).delay(1000).hide(300)

}





const handleDatasetEvents = (ds, event, param, mode, component) => {

    let $message = component.$parent.find(".tool-row.center")

    switch(event) {

        case "fetching":  break;

        

        case "success":  

            if(mode == "set") {

                if(param.insertId) {

                    message($message, "success", "Registro Creado Satisfactoriamente")

                    component.reset()

                } else message($message, "success", "Registro Actualizado Satisfactoriamente")

            } else if(mode == "get") {

                ds.localFilter()

            }

            break;



        case "error":  

            if(mode == "set") {

                if(param.insertId) {

                    message($message, "error", "Hubo un error al crear el elemento")

                    component.reset()

                } else message($message, "error", "Hubo un error al intentar actualizar el registro")

            }

            break;

    }



}



let timer;





function LIST_FORM(options = {}) {



    this.cb = options.cb || function() {}



    this.modelBeforeSet = options.modelBeforeSet

    this.onSet = options.onSet



    this.ds = options.ds || {}

    this.ds.onEvent = (a, b, c, d) => handleDatasetEvents(a, b, c, d, this)



    this.filter_field = options.filter_field

    this.search_function = options.search_function

    this.onRenderListRow = options.onRenderListRow

    this.scheme = options.scheme || []

    this.metadata = options.metadata || {}

    this.pk = options.pk || "id"



    IMP.watch(`${this.ds.model}.data`, this)



    this.$parent = options.$parent

    

    // actions buttons

    this.$reload = this.$parent.find('[data-action="reload"]')

    this.$search = this.$parent.find('[data-action="search"]')

    this.$new = this.$parent.find('[data-action="new"]')

    this.$save = this.$parent.find('[data-action="save"]')



    this.$filter = this.$parent.find(".filter-list")



    // list

    this.$list =  this.$parent.find(".main-list tbody")

     this.$template = this.$parent.find('.template-list')



    // form

    this.$form = this.$parent.find(".main-form")



    if(this.$list.length > 0) {

        this.$list.on("click", "> tr", e => this.ds.setCurrentPK(e.currentTarget.dataset.id))

    }



    if(this.$search.length > 0) this.$search.on("input", e => this.search(e.currentTarget.value))

    if(this.$new.length > 0) this.$new.click(e => this.new())

    if(this.$filter.length > 0) this.$filter.change(e => this.getWithFilter(e.currentTarget.value))

    if(this.$reload.length > 0) this.$reload.click(e => this.getWithFilter("0"))



    if(this.$save.length > 0) this.$save.click(async e => {

        console.log(this.$save[0])

        ListCommand(true, this.$save[0])

        await this.save()

        ListCommand(false, this.$save[0])

    })

}





LIST_FORM.prototype.new = function() {

    this.ds.setCurrentPK()

    this.reset()

}



LIST_FORM.prototype.search = function(value) {

    this.ds.localFilter(item => this.search_function(item, value))

}



LIST_FORM.prototype.save = async function() {

    

    if(this.cb("save", this) === false) return



    let sendData = {};

    let key = this.ds.currentPK || "new";

    

    sendData[key] = {}

    sendData[key]["fields"] = IMP.get_form(this.$form, this.ds.scheme, this.ds.noset)

    sendData[key]["filter"] = {}

    if(this.ds.currentPK) sendData[key]["filter"][this.pk] = this.ds.currentPK



    let result = await this.ds.set(sendData)



    if (result[key].insertId > 1) {
        // Verifica si 'scrollTo' está disponible en este contexto
        if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
            window.scrollTo(this.$parent, this.$list.find("tr").last());
        } else {
            // Alternativa en caso de que 'scrollTo' no esté disponible
            console.log('scrollTo no está disponible en este entorno.');
        }
    }

    

}



LIST_FORM.prototype.reset = function() {

    IMP.set_form(this.$form, this.ds.scheme, this.ds.noreset)

    this.cb("reset", this)

}



LIST_FORM.prototype.get = async function(value, customfilter) {



    let filter = {filter:{}}

    if(value != "0") filter.filter[this.filter_field] = value

    if(customfilter) filter = customfilter

    this.ds.currentPK = null

    this.$list.html("")

    this.reset()

    await this.ds.get(filter)

    this.cb("get", this)

}



async function ListCommand(start, elem, ok = true) {

        

    let $elem = $(elem)

    if(start) {

        if($elem.data("busy")) return

        $elem.data("html", $elem.html())

        $elem.data("busy", true)

        $elem.html("...")

    } else {

        $elem.html(`${ok ? `<i class="fas fa-check" style="color:green"></i>` : `<i class="fas fa-times" style="color:red"></i>`} &nbsp;` + $elem.data("html"))

        setTimeout(e => {

            $elem.data("busy", false)

            $elem.html($elem.data("html"))

        }, 1300)

    }

    

}







function Tags(element) {



    let DOMParent = element,

        DOMList,

        DOMInput,

        dataAttribute,

        arrayOfList

    ;

  

    function DOMCreate() {

        var ul = document.createElement('ul');

        var input = document.createElement('input');

        DOMParent.appendChild(ul);

        DOMParent.appendChild(input);

  

        DOMList = DOMParent.firstElementChild;

        DOMInput = DOMParent.lastElementChild;

    }

  

    function DOMRender() {

    

        DOMList.innerHTML = '';

  

        arrayOfList.forEach(function (currentValue, index) {

            if(currentValue == "") return

            var li = document.createElement('li');

            li.innerHTML = "".concat(currentValue, " <a>&times;</a>");

            li.querySelector('a').addEventListener('click', function () {

                onDelete(index);

                return false;

            });

            DOMList.appendChild(li);

            DOMParent.setAttribute('data-simple-tags', arrayOfList.toString());

        });

    }

  

    function onDelete(id) {

        arrayOfList = arrayOfList.filter(function (currentValue, index) {

            if (index == id) return false;

            return currentValue;

        });

        DOMRender();

    }

  

    dataAttribute = DOMParent.getAttribute('data-simple-tags');

    if(!dataAttribute) dataAttribute = []

    else dataAttribute = dataAttribute.split(','); // store array of data attribute in arrayOfList



    arrayOfList = dataAttribute.map(function (currentValue) {

        return currentValue.trim();

    });

  

    DOMCreate();

    DOMRender();

    

    DOMInput.addEventListener('keyup', function (event) {

        var text = this.value.trim(); // check if ',' or 'enter' key was press

        if (event.keyCode == 13) {

        // check if empty text when ',' is remove

            if(text.includes(',')) {

                arrayOfList = text.split(",")

            } else if(text == "CLR"){

                arrayOfList = []

            } else {

                arrayOfList.push(text)

            }

            this.value = '';

        }

        if (event.keyCode == 14) {

            arrayOfList = []

        }

        DOMRender();

    });

}



function extractTags($elem, data, field) {

	let $elems = $elem.find("li"), s = "";

	if($elems.length == 0) return ""

	$elems.each(function() {

		s += this.innerHTML.replace("<a>×</a>", "").trim().replaceAll(" ", "+") + ' '

	})

	return s.substring(0, s.length - 1);

}



function noErrorParse(data) {

	if(!data || data == "") return {}

    let d = {}

    try {d = JSON.parse(data)} catch(e) {d = {}}

    return d

}





function getTags($elems, data) {

    let extractData

    $elems.each(function() {

        let $elem = $(this),

            key = $elem.data("key"),

            $input,

            value

        ;

        if(!key) return

        if($elem.hasClass("simple-tags")) {

            extractData = extractTags($elem)

            if(extractData != "") data[key] = extractData

            else delete data[key]

        } else if($elem.hasClass("switch")) {

            $input = $elem.find("input")

            if($input.prop("checked")) data[key] = "1"

            else delete data[key]

        } else if($elem.hasClass("input")) {

            $input = $elem.find("input")

            value = $input.val().trim()

            if(value != "") data[key] = value

            else delete data[key]

        }

    })

    return data

}



function setTags($elems, data) {

    $elems.each(function() {

        let $elem = $(this),

            key = $elem.data("key"),

            $input

        ;



        if($elem.hasClass("simple-tags")) {

            $input = $elem.find("input")

                // clear

            const event = new KeyboardEvent('keyup', {keyCode: 14, which: 14});

            $input[0].dispatchEvent(event);



            if(data[key] != undefined) {

                $input.val(String(data[key]).replaceAll(" ", ","))

                const event = new KeyboardEvent('keyup', {keyCode: 13, which: 13});

                $input[0].dispatchEvent(event);

            }

        } else if($elem.hasClass("switch")) {

            $input = $elem.find("input")

            $input.prop("checked", Boolean(data[key]))

        } else if($elem.hasClass("input")) {

            $input = $elem.find("input")

            $input.val(data[key])

        }

    })

}









// BN TABS

//-----------------------------------------------------------------------------------------------------------

function bnInitTabs($target, initIndex = 0, cb)

{

	$target.addClass("bn-tabs").find(".tab-menu").eq(0).on("click", "> div", e => {

		bnSetTabIndex($target, $target.find(".tab-menu").eq(0).find("> div").index($(e.currentTarget)), cb)

	})

	bnSetTabIndex($target, initIndex, cb);

}



function bnSetTabIndex($target, index, cb)

{

	let $tabs = $target.find(".tab-menu").eq(0),

		$cont = $target.find(".tab-container").eq(0)

	;

	$tabs.find("> div").eq(index).addClass("tab-active").siblings().removeClass("tab-active");

	$cont.find("> .cont-active").stop().fadeOut(0).removeClass("cont-active");

	$cont.find("> .tab-info").eq(index).fadeIn(1000).addClass("cont-active");

	if(typeof cb == "function") cb(index)

}


export { DATASET, IMP , _fetch,LIST_FORM,setTags,getTags};














