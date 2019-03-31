"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Firestore = require('@google-cloud/firestore');
const ramda_1 = require("ramda");
// Database
exports.db = new Firestore();
// Collections
exports.companies = exports.db.collection('companies');
// Functions
exports.existing = ramda_1.filter(ramda_1.propEq('exists', true));
exports.getAllData = (docRefs) => __awaiter(this, void 0, void 0, function* () {
    const docSnapshots = exports.existing(yield exports.db.getAll(docRefs));
    const docs = ramda_1.map((d) => (Object.assign({ id: d.id }, d.data())))(docSnapshots);
    return docs;
});
exports.getData = (docRef) => __awaiter(this, void 0, void 0, function* () {
    const docSnapshot = yield docRef.get();
    const doc = Object.assign({ id: docSnapshot.id }, docSnapshot.data());
    return doc;
});
//# sourceMappingURL=db.js.map