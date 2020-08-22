import { StyleSheet } from "react-native";

export default StyleSheet.create({
  containerView: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
  },
  title: {},
  logo: {
    flex: 1,
    height: 120,
    width: 90,
    alignSelf: "center",
    margin: 30,
  },
  input: {
    height: 48,
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: "white",
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 30,
    marginRight: 30,
    paddingLeft: 16,
  },
  button: {
    backgroundColor: "#788eec",
    marginLeft: 30,
    marginRight: 30,
    marginTop: 20,
    height: 48,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },

  errorText: {
    fontSize: 12,
    color: "red",
    textAlign: "center",
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
  cardDescription: {
    fontSize: 15,
    color: "grey",
    marginBottom: 5,
    marginTop: 5,
  },
  cardDate: {
    fontSize: 12,
    color: "grey",
  },
  cardStatus: {
    fontSize: 12,
    color: "grey",
  },
  cardActions: {
    padding: 10,
    marginTop: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardDivider: {
    borderWidth: 1,
    borderColor: "#777E8B",
    marginBottom: 4,
    marginTop: 4,
  },
  nameText: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 30,
    marginRight: 30,
    paddingLeft: 16,
  },
});
