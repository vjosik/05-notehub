import { Formik, Form, Field, type FormikHelpers, ErrorMessage } from "formik";
import { noteTags, type NoteTag } from "../../types/note";
import * as Yup from "yup";
import css from "./NoteForm.module.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "../../services/noteService";

interface NoteFormProps {
  onClose: () => void;
}

interface NotesFormValues {
  title: string;
  content: string;
  tag: NoteTag;
}

const initialValues: NotesFormValues = {
  title: "",
  content: "",
  tag: "Todo" as NoteTag,
};

const NotesSchema = Yup.object().shape({
  title: Yup.string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(50, "Maximum 50 characters"),
  content: Yup.string().max(500, "Maximum content 500 characters"),
  tag: Yup.string().required().oneOf(noteTags, "Choose a valid tag value"),
});

export default function NoteForm({ onClose }: NoteFormProps) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: createNote,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["fetchNotes"] });
      onClose();
    },
  });

  const handleSubmit = (
    values: NotesFormValues,
    actions: FormikHelpers<NotesFormValues>,
  ) => {
    console.log(values);
    mutate(values);
    actions.resetForm();
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={NotesSchema}
    >
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
          <ErrorMessage name="content" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="tag">Tag</label>
          <Field as="select" id="tag" name="tag" className={css.select}>
            <option value="">Select a tag</option>
            {noteTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </Field>
          <ErrorMessage name="tag" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button type="button" className={css.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={css.submitButton} disabled={false}>
            Create note
          </button>
        </div>
      </Form>
    </Formik>
  );
}
