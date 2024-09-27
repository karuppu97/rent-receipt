import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const ReceiptForm = ({ onGenerate }) => {
  return (
    <div className="form-container">
      <Formik
        initialValues={{
          receiptNo: "",
          tenantName: "",
          roomNo: "",
          amount: "",
          date: "",
          phno: "",
          email: "",
        }}
        validationSchema={Yup.object({
          receiptNo: Yup.string().required("Required"),
          tenantName: Yup.string().required("Required"),
          roomNo: Yup.string().required("Required"),
          amount: Yup.number()
            .required("Required")
            .positive("Must be a positive number"),
          date: Yup.date().required("Required"),
          email: Yup.string()
            .email("Invalid email address")
            .required("Required"),
          phno: Yup.string()
            .required("Required")
            .matches(phoneRegExp, "Phone number is not valid"),
        })}
        onSubmit={(values, { setSubmitting }) => {
          onGenerate(values);
          setSubmitting(false);
        }}
      >
        <Form>
          <div className="form-group">
            <label htmlFor="receiptNo">Receipt No</label>
            <Field type="text" id="receiptNo" name="receiptNo" />
            <ErrorMessage name="receiptNo" component="div" className="error" />
          </div>
        
          <div className="form-group">
            <label htmlFor="tenantName">Tenant Name</label>
            <Field type="text" id="tenantName" name="tenantName" />
            <ErrorMessage name="tenantName" component="div" className="error" />
          </div>

          <div className="form-group">
            <label htmlFor="roomNo">Room No</label>
            <Field type="text" id="roomNo" name="roomNo" />
            <ErrorMessage name="roomNo" component="div" className="error" />
          </div>

          <div className="form-group">
            <label htmlFor="amount">Amount</label>
            <Field type="number" id="amount" name="amount" />
            <ErrorMessage name="amount" component="div" className="error" />
          </div>

          <div className="form-group">
            <label htmlFor="date">Date</label>
            <Field type="date" id="date" name="date" />
            <ErrorMessage name="date" component="div" className="error" />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <Field name="email" type="email" />
            <ErrorMessage name="email" component="div" className="error" />
          </div>

          <div className="form-group">
            <label htmlFor="phno">Mobile No</label>
            <Field type="text" id="phno" name="phno" />
            <ErrorMessage name="phno" component="div" className="error" />
          </div>
          <div className="form-group">
            <button type="submit">Generate Receipt</button>
          </div>
        </Form>
      </Formik>

      <style jsx>{`
        .form-container {
          max-width: 600px;
          margin: auto;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .form-group {
          margin-bottom: 15px;
        }
        .form-group label {
          display: block;
          margin-bottom: 5px;
        }
        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        .form-group .error {
          color: red;
          font-size: 0.875em;
        }
        button {
          padding: 10px 15px;
          border: none;
          border-radius: 4px;
          background-color: #007bff;
          color: white;
          cursor: pointer;
        }
        button:disabled {
          background-color: #6c757d;
        }
      `}</style>
    </div>
  );
};

export default ReceiptForm;
