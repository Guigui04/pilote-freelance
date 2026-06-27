import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, color: "#1f2937", fontFamily: "Helvetica" },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 30 },
  title: { fontSize: 22, fontFamily: "Helvetica-Bold", color: "#4f46e5" },
  issuer: { fontSize: 9, color: "#6b7280", textAlign: "right" },
  block: { marginBottom: 16 },
  label: { fontSize: 8, color: "#9ca3af", textTransform: "uppercase", marginBottom: 2 },
  strong: { fontFamily: "Helvetica-Bold" },
  row: { flexDirection: "row" },
  metaRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24 },
  table: { marginTop: 10 },
  thead: { flexDirection: "row", borderBottomWidth: 1, borderColor: "#e5e7eb", paddingBottom: 4 },
  th: { fontFamily: "Helvetica-Bold", fontSize: 9, color: "#6b7280" },
  tr: { flexDirection: "row", paddingVertical: 5, borderBottomWidth: 0.5, borderColor: "#f3f4f6" },
  cDesc: { flex: 4 },
  cQty: { flex: 1, textAlign: "right" },
  cPrice: { flex: 1.5, textAlign: "right" },
  cVat: { flex: 1, textAlign: "right" },
  cTotal: { flex: 1.5, textAlign: "right" },
  totals: { marginTop: 16, alignSelf: "flex-end", width: 200 },
  totalLine: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 2 },
  grandTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
    paddingTop: 6,
    borderTopWidth: 1,
    borderColor: "#1f2937",
  },
  footer: { position: "absolute", bottom: 30, left: 40, right: 40, fontSize: 8, color: "#9ca3af" },
});

type Item = {
  description: string;
  quantity: string;
  unitPrice: string;
  vatRate: string;
};

export type FinanceDocData = {
  kind: "facture" | "devis";
  number: string;
  issueDate: string | null;
  dueLabel: string;
  dueDate: string | null;
  company: { name?: string | null; address?: string | null; siret?: string | null } | null;
  items: Item[];
  subtotal: string;
  vatAmount: string;
  total: string;
  legalMentions?: string | null;
  notes?: string | null;
  issuer: {
    name?: string;
    address?: string;
    email?: string;
    siret?: string;
    phone?: string;
  };
  currency?: string;
};

function money(v: string | number, currency = "EUR") {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency }).format(Number(v));
}
function fdate(v: string | null) {
  if (!v) return "—";
  return new Intl.DateTimeFormat("fr-FR").format(new Date(v));
}

function FinanceDoc(d: FinanceDocData) {
  const title = d.kind === "facture" ? "FACTURE" : "DEVIS";
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>{title}</Text>
            <Text style={{ marginTop: 4 }}>{d.number}</Text>
          </View>
          <View style={styles.issuer}>
            <Text style={styles.strong}>{d.issuer.name ?? "—"}</Text>
            {d.issuer.address ? <Text>{d.issuer.address}</Text> : null}
            {d.issuer.email ? <Text>{d.issuer.email}</Text> : null}
            {d.issuer.phone ? <Text>{d.issuer.phone}</Text> : null}
            {d.issuer.siret ? <Text>SIRET : {d.issuer.siret}</Text> : null}
          </View>
        </View>

        <View style={styles.metaRow}>
          <View>
            <Text style={styles.label}>Adressé à</Text>
            <Text style={styles.strong}>{d.company?.name ?? "—"}</Text>
            {d.company?.address ? <Text>{d.company.address}</Text> : null}
            {d.company?.siret ? <Text>SIRET : {d.company.siret}</Text> : null}
          </View>
          <View style={{ textAlign: "right" }}>
            <Text style={styles.label}>Date d'émission</Text>
            <Text style={{ marginBottom: 6 }}>{fdate(d.issueDate)}</Text>
            <Text style={styles.label}>{d.dueLabel}</Text>
            <Text>{fdate(d.dueDate)}</Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.thead}>
            <Text style={[styles.th, styles.cDesc]}>Désignation</Text>
            <Text style={[styles.th, styles.cQty]}>Qté</Text>
            <Text style={[styles.th, styles.cPrice]}>PU HT</Text>
            <Text style={[styles.th, styles.cVat]}>TVA</Text>
            <Text style={[styles.th, styles.cTotal]}>Total HT</Text>
          </View>
          {d.items.map((it, i) => (
            <View style={styles.tr} key={i}>
              <Text style={styles.cDesc}>{it.description}</Text>
              <Text style={styles.cQty}>{Number(it.quantity)}</Text>
              <Text style={styles.cPrice}>{money(it.unitPrice, d.currency)}</Text>
              <Text style={styles.cVat}>{Number(it.vatRate)}%</Text>
              <Text style={styles.cTotal}>
                {money(Number(it.quantity) * Number(it.unitPrice), d.currency)}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.totals}>
          <View style={styles.totalLine}>
            <Text>Total HT</Text>
            <Text>{money(d.subtotal, d.currency)}</Text>
          </View>
          <View style={styles.totalLine}>
            <Text>TVA</Text>
            <Text>{money(d.vatAmount, d.currency)}</Text>
          </View>
          <View style={styles.grandTotal}>
            <Text style={styles.strong}>Total TTC</Text>
            <Text style={styles.strong}>{money(d.total, d.currency)}</Text>
          </View>
        </View>

        {d.notes ? (
          <View style={[styles.block, { marginTop: 24 }]}>
            <Text style={styles.label}>Notes</Text>
            <Text>{d.notes}</Text>
          </View>
        ) : null}

        <Text style={styles.footer}>
          {d.legalMentions ?? ""}
        </Text>
      </Page>
    </Document>
  );
}

export async function renderFinancePdf(data: FinanceDocData): Promise<Buffer> {
  return renderToBuffer(<FinanceDoc {...data} />);
}
