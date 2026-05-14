import { useState, useEffect } from "react";
import { DollarSign, FileText, Tag, Calendar, ArrowLeft, Receipt } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { FormTemplate } from "../../components/common/form/Form";
import { InputField } from "../../components/widgets/InputField";
import { FormSection } from "../../components/widgets/FormSection";
import { Button } from "../../components/widgets/Button";
import { useCreateTransactionMutation, useUpdateTransactionMutation, useGetTransactionByIdQuery } from "../../services/features/cemsApi";

const CreateTransaction = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const { data: txData, isLoading: isFetching } = useGetTransactionByIdQuery(Number(id), { skip: !isEdit });
  const [createTransaction, { isLoading: isCreating }] = useCreateTransactionMutation();
  const [updateTransaction, { isLoading: isUpdating }] = useUpdateTransactionMutation();

  const [form, setForm] = useState({ title: "", amount: "", date: "", type: "", reference: "" });

  useEffect(() => {
    if (isEdit && txData?.data) {
      const t = txData.data;
      setForm({
        title: t.title || "",
        amount: t.amount?.toString() || "",
        date: t.transaction_date || "",
        type: t.type || "",
        reference: t.reference_number || ""
      });
    }
  }, [isEdit, txData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title: form.title,
        amount: parseFloat(form.amount) || 0,
        transaction_date: form.date,
        type: form.type,
        reference_number: form.reference,
        category: form.type
      };
      if (isEdit) {
        await updateTransaction({ id: Number(id), data: payload }).unwrap();
      } else {
        await createTransaction(payload).unwrap();
      }
      navigate("/finance/transactions/all");
    } catch (error) {
      console.error("Failed to save transaction:", error);
    }
  };

  const isLoading = isCreating || isUpdating || isFetching;

  return (
    <FormTemplate
      title={isEdit ? "Modify Transaction Record" : "Log Financial Activity"}
      description={isEdit ? "Update existing transaction details, amounts, or reference documentation." : "Register a new income or expense flow into the project ledger."}
      width="full"
      onSubmit={handleSubmit}
      headerActions={
        <Button variant="outline" size="sm" onClick={() => navigate("/finance/transactions/all")} icon={<ArrowLeft size={16} />}>
          Back to Ledger
        </Button>
      }
      footer={
        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
          <Button variant="outline" type="button" onClick={() => navigate("/finance/transactions/all")}>Cancel</Button>
          <Button variant="primary" type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : isEdit ? "Update Record" : "Save Transaction"}
          </Button>
        </div>
      }
    >
      <FormSection title="Transaction Attributes" columns={2}>
        <InputField label="Transaction Title" name="title" required icon={FileText} value={form.title} onChange={handleChange} placeholder="e.g. Site Material Procurement" />
        <InputField label="Monetary Amount" name="amount" type="number" required icon={DollarSign} value={form.amount} onChange={handleChange} placeholder="0.00" />
        <InputField label="Effective Date" name="date" type="date" required icon={Calendar} value={form.date} onChange={handleChange} />
        <InputField label="Financial Category" name="type" required icon={Tag} value={form.type} onChange={handleChange} placeholder="e.g. Operating Expense" />
        <InputField label="Reference / Invoice No." name="reference" required icon={Receipt} value={form.reference} onChange={handleChange} placeholder="INV-000-000" />
      </FormSection>
    </FormTemplate>
  );
};

export default CreateTransaction;

