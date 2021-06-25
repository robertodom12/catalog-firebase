
import * as firebase from "../../providers/connectionFirebase.js";
const bd = firebase.firestore()

export class Catalog {
    constructor(type) {
        this.type = type
    }

    getReferences() {
        let referencesObj = {
            outputPath: '',
            storageRef: '',
            templatePath: '',
            firebaseQuery: bd.collection('products').where("CAMPLIB19", '==', "A")
        }
        switch (this.type) {
            case "1":
                referencesObj.outputPath = './output.pdf'
                referencesObj.storageRef = 'catalogs/catalogo.pdf'
                referencesObj.templatePath = '/app/src/api/catalogs/pdf/templates/template.html'
                break;
            case "2":
                referencesObj.outputPath = './output_wholesaler.pdf'
                referencesObj.storageRef = 'catalogs/catalogo_mayoristas.pdf'
                referencesObj.templatePath = '/app/src/api/catalogs/pdf/templates/template_wholesaler.html'
                break;
            case "3":
                referencesObj.outputPath = './output_offert.pdf'
                referencesObj.storageRef = 'catalogs/catalogo_ofertas.pdf'
                referencesObj.templatePath = '/app/src/api/catalogs/pdf/templates/template_offert.html'
                referencesObj.firebaseQuery = bd.collection('products').where("CAMPLIB19", '==', "A").where("CAMPLIB18", '==', "S").orderBy("position", "asc")
                break;
            case "4":
                referencesObj.outputPath = './output_list.pdf'
                referencesObj.storageRef = 'catalogs/catalogo_simple.pdf'
                referencesObj.templatePath = '/app/src/api/catalogs/pdf/templates/template_simple.html'
                break;

            default:

                break;
        }

        return referencesObj
    }
}




