package com.example.SE.Project.Model;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum PublicationStatus {
    @JsonProperty("Submitted") SUBMITTED,
    @JsonProperty("Editorial Revision") EDITORIAL_REVISION,
    @JsonProperty("Accepted") ACCEPTED,
    @JsonProperty("Published") PUBLISHED
}
