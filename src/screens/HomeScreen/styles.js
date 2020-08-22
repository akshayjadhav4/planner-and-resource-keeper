import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    marginHorizontal: 10,
    marginVertical: 10,
    backgroundColor: "#EAF0F1",
    padding: 20,
    elevation: 4,
    borderRadius: 5,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#333",
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "800",
  },
  cardDate: {
    fontSize: 15,
    color: "grey",
  },
  cardProjectStatus: {
    fontSize: 15,
    color: "grey",
  },
});
