# Network debugging — Wireshark (OSC / UDP)

Filters for inspecting traffic between the app and **X Air / M Air** desks over UDP. These are **lab** filters: replace the IPs with those on your network.

Architecture context (who opens the socket, etc.): [CONNECTIVITY.md](../reference/CONNECTIVITY.md).

---

## Template

Variables to adapt for each capture:

| Variable | Lab example |
|----------|-------------|
| `SRC` | IP of the machine running MMC |
| `DST` | Desk IP (or the other endpoint) |

Common noise to exclude (heartbeat, meters, status):

```
!frame contains "/xinfo" && !frame contains "/xremotenfb" && !frame contains "renew" && !frame contains "meters" && !frame contains "status"
```

Base filter (UDP between two hosts only):

```
udp && ip.src==SRC && ip.dst==DST
```

---

## Lab filters (reference)

### Dev Mac → desk `192.168.1.21`

`SRC=192.168.1.11`, `DST=192.168.1.21`:

```
udp && ip.src==192.168.1.11 && ip.dst==192.168.1.21 && !frame contains "/xinfo" && !frame contains "/xremotenfb" && !frame contains "renew" && !frame contains "meters" && !frame contains "status"
```

### Same Mac → another IP, meters packets only `/meters/0`

`DST=192.168.1.19`:

```
udp && ip.src==192.168.1.11 && ip.dst==192.168.1.19 && !frame contains "/xinfo" && !frame contains "/xremotenfb" && !frame contains "renew" && !frame contains "status" && frame contains "/meters/0"
```

### Geekom (`192.168.1.22`) → `192.168.1.21`

```
udp && ip.src==192.168.1.22 && ip.dst==192.168.1.21 && !frame contains "/xinfo" && !frame contains "/xremotenfb" && !frame contains "renew" && !frame contains "meters" && !frame contains "status"
```

### M4 (`192.168.1.10`) → `192.168.1.21`

```
udp && ip.src==192.168.1.10 && ip.dst==192.168.1.21 && !frame contains "/xinfo" && !frame contains "/xremotenfb" && !frame contains "renew" && !frame contains "meters" && !frame contains "status"
```

---

## Using Wireshark

1. Interface: the one with traffic toward the desk subnet (Wi‑Fi or Ethernet).
2. **Capture → Options → Filter** (optional): you can paste the filter before capturing, or filter in the packet view afterward.
3. To see only “interesting” commands, start with the filter without excluding `meters`; then add the template exclusions.

---

## Related

- Setup and plugins: [DEVELOPMENT.md](./DEVELOPMENT.md)
- OSC drivers: `src/mixers/drivers/xair/`
