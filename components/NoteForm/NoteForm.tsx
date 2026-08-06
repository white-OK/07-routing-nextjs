"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { createNote } from "@/lib/api";
import type { NewNote, NoteTag } from "@/types/note";
import css from "./NoteForm.module.css";

interface NoteFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const ALLOWED_TAGS: NoteTag[] = [
  "Todo",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
];

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must be 50 characters or less")
    .required("Title is required"),
  content: Yup.string().max(500, "Content must be 500 characters or less"),
  tag: Yup.string()
    .oneOf(ALLOWED_TAGS, "Invalid tag")
    .required("Tag is required"),
});

const initialValues: NewNote = {
  title: "",
  content: "",
  tag: "Todo" as NoteTag,
};

export const NoteForm = ({ onSuccess, onCancel }: NoteFormProps) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (newNote: NewNote) => createNote(newNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note created successfully!");
      onSuccess();
    },
    onError: () => {
      toast.error("Failed to create note.");
    },
  });

  const handleSubmit = (values: NewNote) => {
    mutate(values);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isValid, dirty }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" type="text" name="title" className={css.input} />
            <ErrorMessage name="title" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field
              as="textarea"
              id="content"
              name="content"
              rows={8}
              className={css.textarea}
            />
            <ErrorMessage
              name="content"
              component="span"
              className={css.error}
            />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field as="select" id="tag" name="tag" className={css.select}>
              {ALLOWED_TAGS.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </Field>
            <ErrorMessage name="tag" component="span" className={css.error} />
          </div>

          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={onCancel}
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={css.submitButton}
              disabled={isPending || !isValid || !dirty}
            >
              {isPending ? "Creating..." : "Create note"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default NoteForm;
