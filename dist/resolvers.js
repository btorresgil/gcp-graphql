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
const db_1 = require("./db");
const resolvers = {
    Query: {
        hello: (_, { name }) => `Hello ${name || 'World'}`,
        companies: () => __awaiter(this, void 0, void 0, function* () {
            return yield db_1.getAllData(yield db_1.companies.listDocuments());
        }),
        company: (_, { id }) => __awaiter(this, void 0, void 0, function* () {
            return yield db_1.getData(db_1.companies.doc(id));
        }),
    },
};
exports.default = resolvers;
//# sourceMappingURL=resolvers.js.map