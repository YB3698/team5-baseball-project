package com.baseball.baseball_pj.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "POLL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PollEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "poll_id")
    private Long pollId;

    @Column(name = "poll_title", length = 255)
    private String pollTitle;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "is_active", length = 1)
    private String isActive;
}
