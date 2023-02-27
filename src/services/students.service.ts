import { iOption, iParams, iStudent } from "../declarations";

export class Students {
  model: any = undefined;
  constructor(options: iOption) {
    this.model = options.model;
  }
  async getAllStudents(params: iParams) {
    console.log(params)
    if (params.page) {
      try {
        let locale = params.locale;
        let fields =locale && locale==='en'?
        {lastName_en:1,firstName_en:1,address_en:1}:
        {lastName_ar:1,firstName_ar:1,address_ar:1}
        let records = await this.model.find(
          { creationDate: { $lte: Date.now() } },
          {
           ...fields,
            phoneNumber: 1,
            CountryCode: 1,
            id: 1,
            dateOfBirth: 1,
            creationDate: 1,
          },
          { skip: parseInt(params.page), limit: 10}
        );

        return {
          success: true,
          data: {
            current_page: params.page,
            page_counts: params.limit,
            data: records,
          },
        };
      } catch (err) {
        return { success: false, data: err };
      }
    }
    return null;
  }
  async getOne(params: iParams) {
    if (params.id && params.locale) {
      let record = await this.model.findById(params.id).select(
        params.locale === "en"
          ? { firstName_ar: 0, lastName_ar: 0, address_ar: 0 }
          : {
              firstName_en: 0,
              lastName_en: 0,
              address_en: 0,
            }
      );

      if (record) {
        return { success: true, data: record };
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
  async createOne(data: iStudent) {
    let record = new this.model(data);
    try {
      let res = await record.save();
      return { success: true, data: res };
    } catch (err) {
      return { success: false, data: err };
    }
  }
  async updateOne(data: Partial<iStudent>, id: string) {
    if (id) {
      try {
        let res = await this.model.findOneAndUpdate({ id }, { data });
        return { success: true, data: res };
      } catch (err) {
        return { success: false, data: err };
      }
    } else {
      return null;
    }
  }
  async remove(id: string) {
    if (id) {
      try {
        let res = await this.model.deleteOne({ _id: id });
        return { success: true, data: res };
      } catch (err) {
        return { success: false, data: err };
      }
    } else {
      return null;
    }
  }
}
