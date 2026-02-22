import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

type QuoteItem = {
  name: string;
  description?: string | null;
  price: number;
};

type QuotePdfProps = {
  organization: {
    name: string;
    logo_url?: string | null;
  };
  customer: {
    name: string;
    company?: string | null;
  };
  quote: {
    id: string;
    title: string;
    description?: string | null;
    total_price: number;
    created_at: string;
    public_url?: string | null;
  };
  items: QuoteItem[];
};

const styles = StyleSheet.create({
  page: {
    padding: 48,
    fontSize: 11,
    color: "#101014",
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  logo: {
    width: 120,
    height: 32,
    objectFit: "contain",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 6,
  },
  subtitle: {
    color: "#5E5E72",
  },
  section: {
    marginBottom: 24,
  },
  label: {
    color: "#5E5E72",
    textTransform: "uppercase",
    fontSize: 9,
    marginBottom: 6,
  },
  table: {
    borderWidth: 1,
    borderColor: "#E7E7EF",
    borderRadius: 10,
  },
  row: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFF6",
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  cellName: {
    width: "55%",
  },
  cellDesc: {
    width: "25%",
    color: "#6A6A7A",
  },
  cellPrice: {
    width: "20%",
    textAlign: "right",
    fontWeight: "bold",
  },
  total: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 16,
    fontSize: 14,
  },
  footer: {
    marginTop: 32,
    fontSize: 9,
    color: "#8A8AA0",
  },
  link: {
    marginTop: 8,
    fontSize: 9,
    color: "#5B5BD6",
  },
});

export const QuotePdf = ({
  organization,
  customer,
  quote,
  items,
}: QuotePdfProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{quote.title}</Text>
          <Text style={styles.subtitle}>{organization.name}</Text>
        </View>
        {organization.logo_url ? (
          <Image style={styles.logo} src={organization.logo_url} />
        ) : null}
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Preparado para</Text>
        <Text>{customer.name}</Text>
        {customer.company ? <Text>{customer.company}</Text> : null}
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Resumen</Text>
        <Text>{quote.description ?? "Propuesta comercial"}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Items</Text>
        <View style={styles.table}>
          {items.map((item, index) => (
            <View
              key={`${item.name}-${index}`}
              style={[
                styles.row,
                index === items.length - 1 ? styles.rowLast : {},
              ]}
            >
              <Text style={styles.cellName}>{item.name}</Text>
              <Text style={styles.cellDesc}>
                {item.description ?? ""}
              </Text>
              <Text style={styles.cellPrice}>
                ${item.price.toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
        <View style={styles.total}>
          <Text>Total: ${quote.total_price.toFixed(2)}</Text>
        </View>
      </View>

      <Text style={styles.footer}>
        Generado por QuoteAI el {new Date(quote.created_at).toDateString()}
      </Text>
      {quote.public_url ? (
        <Text style={styles.link}>{quote.public_url}</Text>
      ) : null}
    </Page>
  </Document>
);
