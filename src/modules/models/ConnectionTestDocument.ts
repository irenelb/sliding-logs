import { Document, Model, model, Schema } from 'mongoose';
import opts from '../../config/options';

const testMongoSchema = new Schema<ConnectionTestDocument>({
  start: { type: Date, require: true, default: Date.now },
  options: { type: JSON, require: true },
});

interface ConnectionTestDocument extends Document {
  start?: Date;
  options: any;
}

const ConnectionTestMongo = model<
  ConnectionTestDocument,
  Model<ConnectionTestDocument>
>(opts.snapshot().app.dbName, testMongoSchema);

export default ConnectionTestMongo;
