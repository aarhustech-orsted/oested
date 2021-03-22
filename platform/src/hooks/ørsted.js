import useAuth from "./auth";

import { decode } from "js-base64";

export default function useØrsted() {
  const auth = useAuth();

  const fetch = (url) =>
    window
      .fetch(url, {
        headers: {
          Authorization: "Bearer " + auth.user.value.token,
        },
      })
      .then((r) => r.json());

  function recent_invoices() {
    return new Promise(async (resolve) => {
      const invoices = (await fetch("http://localhost:5000/api/invoices"))
        .map((data) => {
          const p = data.fileName.split("/")[1].split("-");
          const year = p[1];
          const month = p[2];
          const day = p[3];

          return {
            date: new Date(year, month - 1, day, 0, 0, 0, 0) || new Date(),
            address: decode(data.fileName.split("/")[0])
              .split("|")
              .filter((e) => e !== "")
              .join(", "),
            filename:
              data.fileName.split("/")[1].split("-").splice(0, 4).join("-") +
              ".pdf",
            download: data.downloadUrl,
          };
        })
        .sort((a, b) => {
          const av = a.date.getTime();
          const bv = b.date.getTime();
          return av < bv ? 1 : av == bv ? 0 : -1;
        });

      invoices.length = 5;

      resolve(invoices);
    });
  }

  function usage_monthly(address = null) {
    return new Promise(async (resolve) => {
      const usage = (
        await fetch(
          "http://localhost:5000/api/invoices" +
            (address !== null ? "/" + address : "")
        )
      )
        .map((data) => {
          const p = data.fileName.split("/")[1].split("-");
          const year = p[1];
          const month = p[2];
          const day = p[3];

          return {
            date: new Date(year, month - 1, day, 0, 0, 0, 0) || new Date(),
            price: +data.fileName
              .split("/")[1]
              .split("-")[4]
              .split(".")
              .splice(0, 2)
              .join("."),
          };
        })
        .sort((a, b) => {
          const av = a.date.getTime();
          const bv = b.date.getTime();
          return av < bv ? 1 : av == bv ? 0 : -1;
        })
        .filter((d) => d.date.getMonth() === new Date().getMonth() + 1)
        .map((d) => d.price)
        .reduce((a, b) => {
          return (a || 0) + (b || 0);
        });

      resolve(usage || 0);
    });
  }

  function usage_yearly(address = null) {
    return new Promise(async (resolve) => {
      const usage = (
        await fetch(
          "http://localhost:5000/api/invoices" +
            (address !== null ? "/" + address : "")
        )
      )
        .map((data) => {
          return +data.fileName
            .split("/")[1]
            .split("-")[4]
            .split(".")
            .splice(0, 2)
            .join(".");
        })
        .reduce((a, b) => {
          return (a || 0) + (b || 0);
        });

      resolve(usage || 0);
    });
  }

  function usage_all(address = null) {
    return new Promise(async (resolve) => {
      const months = new Array(12).fill(0);

      (
        await fetch(
          "http://localhost:5000/api/invoices" +
            (address !== null ? "/" + address : "")
        )
      )
        .map((data) => {
          const p = data.fileName.split("/")[1].split("-");
          const year = p[1];
          const month = p[2];
          const day = p[3];

          return {
            date: new Date(year, month - 1, day, 0, 0, 0, 0) || new Date(),
            price: +data.fileName
              .split("/")[1]
              .split("-")[4]
              .split(".")
              .splice(0, 2)
              .join("."),
          };
        })
        .sort((a, b) => {
          const av = a.date.getTime();
          const bv = b.date.getTime();
          return av < bv ? 1 : av == bv ? 0 : -1;
        })
        .forEach((invoice) => {
          months[invoice.date.getMonth() + 1] = invoice.price;
        });

      resolve({
        columns: [
          "JAN",
          "FEB",
          "MAR",
          "APR",
          "MAJ",
          "JUN",
          "JUL",
          "AUG",
          "SEP",
          "OKT",
          "NOV",
          "DEC",
        ],
        values: months,
      });
    });
  }

  function invoices(address) {
    return new Promise(async (resolve) => {
      const invoices = (
        await fetch(
          "http://localhost:5000/api/invoices" +
            (address !== null ? "/" + address : "")
        )
      )
        .map((data) => {
          const p = data.fileName.split("/")[1].split("-");
          const year = p[1];
          const month = p[2];
          const day = p[3];

          return {
            date: new Date(year, month - 1, day, 0, 0, 0, 0) || new Date(),
            address: decode(data.fileName.split("/")[0])
              .split("|")
              .filter((e) => e !== "")
              .join(", "),
            filename:
              data.fileName.split("/")[1].split("-").splice(0, 4).join("-") +
              ".pdf",
            download: data.downloadUrl,
          };
        })
        .sort((a, b) => {
          const av = a.date.getTime();
          const bv = b.date.getTime();
          return av < bv ? 1 : av == bv ? 0 : -1;
        });

      resolve(invoices);
    });
  }

  function address(id) {
    return new Promise(async (resolve) => {
      const data = await fetch("http://localhost:5000/api/addresses/" + id);

      resolve({
        ...data,
        addressString: data.addressString
          .split("|")
          .filter((e) => e !== "")
          .join(", "),
      });
    });
  }

  function addresses() {
    return new Promise(async (resolve) => {
      resolve(
        (await fetch("http://localhost:5000/api/addresses")).map((data) => {
          return {
            id: data.id,
            address: data.addressString
              .split("|")
              .filter((e) => e !== "")
              .join(", "),
            latest_invoice: {
              date: new Date(),
              price: 1523.5,
            },
          };
        })
      );
    });
  }

  return {
    recent_invoices,
    usage_monthly,
    usage_yearly,
    usage_all,
    invoices,
    address,
    addresses,
  };
}
